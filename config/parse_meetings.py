from lxml import etree

import os
import glob
from typing import List, Dict, Any

import xml.etree.ElementTree as ET
from collections import defaultdict


def parse_speaker_data(metadata):
    speaker_data = {}
    if metadata is not None:
        if metadata.get("tingdokID"):
            speaker_data["aktørTingdokID"] = metadata.get("tingdokID")

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


def parse_meeting_xml(file_path: str) -> Dict[str, Any]:
    tree = etree.parse(file_path)
    root = tree.getroot()

    meeting_data = {"metadata": {}, "agendaItems": []}

    # Extract meeting metadata
    meta_meeting = root.xpath("//MetaMeeting")[0]
    meeting_data["metadata"] = {
        "parlamentariskSession": meta_meeting.xpath("./ParliamentarySession/text()")[0],
        "periodeTingdokID": meta_meeting.xpath("./ParliamentarySession/@tingdokID")[0],
        "aktørGruppe": meta_meeting.xpath("./ParliamentaryGroup/text()")[0],
        "aktørTingdokID": meta_meeting.xpath("./ParliamentaryGroup/@tingdokID")[0],
        "mødeDato": meta_meeting.xpath("./DateOfSitting/text()")[0],
        "mødeNummer": meta_meeting.xpath("./MeetingNumber/text()")[0],
    }
    # Extract agenda items and proposals
    agenda_items = []
    for dagsorden_punkt in root.xpath("//DagsordenPunkt"):
        meta_ft_agenda_item = dagsorden_punkt.xpath("./MetaFTAgendaItem")[0]
        item_data = {}
        if meta_ft_agenda_item.xpath("./ItemNo/text()"):
            item_data["ItemNo"] = meta_ft_agenda_item.xpath("./ItemNo/text()")[0]
        if meta_ft_agenda_item.xpath("./FTCaseNumber/text()"):
            item_data["FTCaseNumber"] = meta_ft_agenda_item.xpath(
                "./FTCaseNumber/text()"
            )[0]
        if meta_ft_agenda_item.xpath("./FTCaseType/text()"):
            item_data["FTCaseType"] = meta_ft_agenda_item.xpath("./FTCaseType/text()")[
                0
            ]
        if meta_ft_agenda_item.xpath("./FTCaseStage/text()"):
            item_data["FTCaseStage"] = meta_ft_agenda_item.xpath(
                "./FTCaseStage/text()"
            )[0]
        if meta_ft_agenda_item.xpath("./ShortTitle/text()"):
            item_data["ShortTitle"] = meta_ft_agenda_item.xpath("./ShortTitle/text()")[
                0
            ]
        ft_case = meta_ft_agenda_item.xpath("./FTCase")
        if ft_case:
            item_data["FTCaseTingdokID"] = ft_case[0].get("tingdokID")

        punkt_tekst = dagsorden_punkt.xpath("./PunktTekst")
        if punkt_tekst:
            item_data["FullText"] = " ".join(punkt_tekst[0].xpath(".//Char/text()"))

        taler_data = []
        for tale in dagsorden_punkt.xpath(".//Tale"):
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
            taler_data.append(speaker_data)

        item_data["speeches"] = taler_data
        agenda_items.append(item_data)

    meeting_data["agendaItems"] = agenda_items

    return meeting_data


def parse_all_meetings() -> Dict[str, Dict[str, Any]]:
    """
    Parse all XML files in the specified directory and extract speaker metadata and content.

    Returns:
        Dict[str, Dict[str, Any]]: Dictionary where keys are derived from XML filenames
        and values are dictionaries containing meeting metadata and a list of speeches.
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


parsed_meetings = parse_all_meetings()
