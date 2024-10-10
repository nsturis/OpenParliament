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


#     with open("meeting_minutes_analysis.txt", "w") as f:
#         f.write("XML Structure:\n")
#         f.write(print_structure(root))

#         f.write("\nData Analysis:\n")
#         data = analyze_data(root)
#         for path, values in data.items():
#             f.write(f"{path}: {len(values)} unique values\n")
#             if len(values) <= 5:
#                 f.write(f"  Sample values: {', '.join(set(values[:5]))}\n")

#         f.write("\nPossible connections to Prisma schema:\n")

#         # Map XML paths to Prisma models and fields
#         xml_to_prisma_mapping = {
#             "Dokument/MetaMeeting/ParliamentarySession": ("Periode", "id"),
#             "Dokument/MetaMeeting/MeetingNumber": ("Moede", "nummer"),
#             "Dokument/MetaMeeting/DateOfSitting": ("Moede", "dato"),
#             "Dokument/MetaMeeting/Location": ("Moede", "lokale"),
#             "Dokument/Tale/Taler/MetaSpeakerMP/OratorFirstName": ("Aktoer", "fornavn"),
#             "Dokument/Tale/Taler/MetaSpeakerMP/OratorLastName": ("Aktoer", "efternavn"),
#             "Dokument/Tale/Taler/MetaSpeakerMP/GroupNameShort": (
#                 "Aktoer",
#                 "gruppenavnkort",
#             ),
#             "Dokument/Tale/Taler/MetaSpeakerMP/OratorRole": ("Aktoer", "rolle"),
#             "Dokument/Tale/TaleSegment/MetaSpeechSegment/StartDateTime": (
#                 "MoedeAktoer",
#                 "starttid",
#             ),
#             "Dokument/Tale/TaleSegment/MetaSpeechSegment/EndDateTime": (
#                 "MoedeAktoer",
#                 "sluttid",
#             ),
#             "Dokument/Tale/TaleSegment/TekstGruppe/Exitus/Linea/Char": (
#                 "FilContent",
#                 "content",
#             ),
#         }

#         for xml_path, values in data.items():
#             if xml_path.endswith("_tingdokID"):
#                 f.write(f"{xml_path}: {', '.join(set(values[:5]))}\n")
#             elif xml_path in xml_to_prisma_mapping:
#                 prisma_model, prisma_field = xml_to_prisma_mapping[xml_path]
#                 f.write(f"{xml_path} -> {prisma_model}.{prisma_field}\n")
#             else:
#                 f.write(f"{xml_path}: -> \n")


# # Usage
# analyze_xml_structure("assets/data/meetings/20222/20222_M21_helemoedet.xml")
