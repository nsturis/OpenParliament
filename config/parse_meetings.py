from lxml import etree

import os
import glob
from typing import List, Dict

import xml.etree.ElementTree as ET
from collections import defaultdict


def parse_speaker_data(metadata):
    speaker_data = {}
    if metadata is not None:
        if metadata.get("tingdokID"):
            speaker_data["tingdokID"] = metadata.get("tingdokID")

        orator_first_name = metadata.xpath("./OratorFirstName/text()")
        if orator_first_name:
            speaker_data["OratorFirstName"] = orator_first_name[0]

        orator_last_name = metadata.xpath("./OratorLastName/text()")
        if orator_last_name:
            speaker_data["OratorLastName"] = orator_last_name[0]

        orator_role = metadata.xpath("./OratorRole/text()")
        if orator_role:
            speaker_data["OratorRole"] = orator_role[0]

    # Handle GroupNameShort, which might be empty for ministers
    group_name = metadata.xpath("./GroupNameShort/text()")
    speaker_data["GroupNameShort"] = group_name[0] if group_name else ""

    # Get the TalerTitel for ministers
    taler_titel = metadata.xpath("../TalerTitel/Linea/Char[@formaChar='Bold']/text()")
    if taler_titel:
        speaker_data["TalerTitel"] = taler_titel[0]

    return speaker_data


def parse_meeting_xml(file_path: str) -> List[Dict[str, str]]:
    """
    Parse a single XML file and extract speaker metadata and content.

    Args:
        file_path (str): Path to the XML file.

    Returns:
        List[Dict[str, str]]: List of dictionaries containing speaker metadata and content.
    """
    tree = etree.parse(file_path)
    root = tree.getroot()

    results = []

    for tale in root.xpath("//Tale"):
        metadata = tale.xpath(".//MetaSpeakerMP")[0]
        if metadata:
            speaker_data = parse_speaker_data(metadata)
        else:
            speaker_data = {}

        speech_segment = tale.xpath(".//TaleSegment")[0]
        speech_metadata = speech_segment.xpath(".//MetaSpeechSegment")[0]
        speaker_data.update(
            {
                "LastModified": (
                    speech_metadata.xpath("./LastModified/text()")[0]
                    if speech_metadata.xpath("./LastModified/text()")
                    else ""
                ),
                "EdixiStatus": (
                    speech_metadata.xpath("./EdixiStatus/text()")[0]
                    if speech_metadata.xpath("./EdixiStatus/text()")
                    else ""
                ),
                "StartDateTime": (
                    speech_metadata.xpath("./StartDateTime/text()")[0]
                    if speech_metadata.xpath("./StartDateTime/text()")
                    else ""
                ),
                "EndDateTime": (
                    speech_metadata.xpath("./EndDateTime/text()")[0]
                    if speech_metadata.xpath("./EndDateTime/text()")
                    else ""
                ),
            }
        )

        content = " ".join(speech_segment.xpath(".//Char/text()"))
        speaker_data["content"] = content

        results.append(speaker_data)

    return results


def parse_all_meetings() -> Dict[str, List[Dict[str, str]]]:
    """
    Parse all XML files in the specified directory and extract speaker metadata and content.

    Returns:
        Dict[str, List[Dict[str, str]]]: Dictionary where keys are derived from XML filenames
        and values are lists of dictionaries containing speaker metadata and content for each speech.
    """
    directory = "assets/data/meetings/20222"
    all_meetings = {}

    for xml_file in glob.glob(os.path.join(directory, "*.xml")):
        # Extract the filename without extension
        filename = os.path.basename(xml_file)
        meeting_key = os.path.splitext(filename)[0]

        # Remove '_helemoedet' from the end if present
        meeting_key = meeting_key.replace("_helemoedet", "")

        all_meetings[meeting_key] = parse_meeting_xml(xml_file)

    return all_meetings


# all_meeting_data = parse_all_meetings()
# for meeting_key, speeches in all_meeting_data.items():
#     print(f"\n{meeting_key}:")
#     for i, speech in enumerate(speeches, 1):
#         print(f"  Speech {i}:")
#         print(
#             f"    Speaker: {speech.get('OratorFirstName', '')} {speech.get('OratorLastName', '')} ({speech.get('GroupNameShort', '')})"
#         )
#         print(f"    Role: {speech.get('OratorRole', '')}")
#         print(
#             f"    Time: {speech.get('StartDateTime', '')} - {speech.get('EndDateTime', '')}"
#         )
#         print(f"    Content: {speech.get('content', '')[:100]}...")
#         print()


def analyze_xml_structure(xml_file_path):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()

    def print_structure(element, depth=0):
        tag_info = element.tag
        if "tingdokID" in element.attrib:
            tag_info += f" (tingdokID: {element.attrib['tingdokID']})"
        return (
            "  " * depth
            + tag_info
            + "\n"
            + "".join(print_structure(child, depth + 1) for child in element)
        )

    def analyze_data(element, path=""):
        data = defaultdict(list)
        current_path = f"{path}/{element.tag}" if path else element.tag

        if element.text and element.text.strip():
            data[current_path].append(element.text.strip())

        if "tingdokID" in element.attrib:
            data[f"{current_path}_tingdokID"].append(element.attrib["tingdokID"])

        for child in element:
            child_data = analyze_data(child, current_path)
            for key, value in child_data.items():
                data[key].extend(value)

        return data

    with open("meeting_minutes_analysis.txt", "w") as f:
        f.write("XML Structure:\n")
        f.write(print_structure(root))

        f.write("\nData Analysis:\n")
        data = analyze_data(root)
        for path, values in data.items():
            f.write(f"{path}: {len(values)} unique values\n")
            if len(values) <= 5:
                f.write(f"  Sample values: {', '.join(set(values[:5]))}\n")

        f.write("\nPossible connections to Prisma schema:\n")

        # Map XML paths to Prisma models and fields
        xml_to_prisma_mapping = {
            "Dokument/MetaMeeting/ParliamentarySession": ("Periode", "id"),
            "Dokument/MetaMeeting/MeetingNumber": ("Moede", "nummer"),
            "Dokument/MetaMeeting/DateOfSitting": ("Moede", "dato"),
            "Dokument/MetaMeeting/Location": ("Moede", "lokale"),
            "Dokument/Tale/Taler/MetaSpeakerMP/OratorFirstName": ("Aktoer", "fornavn"),
            "Dokument/Tale/Taler/MetaSpeakerMP/OratorLastName": ("Aktoer", "efternavn"),
            "Dokument/Tale/Taler/MetaSpeakerMP/GroupNameShort": (
                "Aktoer",
                "gruppenavnkort",
            ),
            "Dokument/Tale/Taler/MetaSpeakerMP/OratorRole": ("Aktoer", "rolle"),
            "Dokument/Tale/TaleSegment/MetaSpeechSegment/StartDateTime": (
                "MoedeAktoer",
                "starttid",
            ),
            "Dokument/Tale/TaleSegment/MetaSpeechSegment/EndDateTime": (
                "MoedeAktoer",
                "sluttid",
            ),
            "Dokument/Tale/TaleSegment/TekstGruppe/Exitus/Linea/Char": (
                "FilContent",
                "content",
            ),
        }

        for xml_path, values in data.items():
            if xml_path.endswith("_tingdokID"):
                f.write(f"{xml_path}: {', '.join(set(values[:5]))}\n")
            elif xml_path in xml_to_prisma_mapping:
                prisma_model, prisma_field = xml_to_prisma_mapping[xml_path]
                f.write(f"{xml_path} -> {prisma_model}.{prisma_field}\n")
            else:
                f.write(f"{xml_path}: -> \n")


# Usage
analyze_xml_structure("assets/data/meetings/20222/20222_M21_helemoedet.xml")
