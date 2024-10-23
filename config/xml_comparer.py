import xml.etree.ElementTree as ET
from collections import defaultdict


# Function to extract the structure of an XML file
def extract_structure(file):
    tree = ET.parse(file)
    root = tree.getroot()
    structure = defaultdict(list)

    def traverse(node, path=""):
        current_path = f"{path}/{node.tag}"
        structure[current_path].append(node.attrib)

        for child in node:
            traverse(child, current_path)

    traverse(root)
    return structure


# Function to compare multiple XML structures
def compare_structures(structures):
    all_keys = set()

    # Collect all paths
    for structure in structures:
        all_keys.update(structure.keys())

    comparison = defaultdict(list)

    for key in all_keys:
        attributes = []
        for structure in structures:
            if key in structure:
                attributes.append(structure[key])
            else:
                attributes.append(None)
        comparison[key] = attributes

    return comparison


import os
import glob

# Get all XML files in assets/data/meetings
xml_files = glob.glob("assets/data/meetings/**/*.xml", recursive=True)

# Sort the files to ensure consistent ordering
xml_files.sort()

# Print the number of files found
print(f"Found {len(xml_files)} XML files")


# Function to extract metadata structure
def extract_metadata_structure(file):
    tree = ET.parse(file)
    root = tree.getroot()
    namespace = {
        "edmx": "http://schemas.microsoft.com/ado/2007/06/edmx",
        "edm": "http://schemas.microsoft.com/ado/2009/11/edm",
    }

    structure = defaultdict(dict)

    # Extract EntityTypes
    for entity_type in root.findall(".//edm:EntityType", namespace):
        entity_name = entity_type.attrib["Name"]
        structure[entity_name]["properties"] = {}
        structure[entity_name]["navigation_properties"] = {}

        for prop in entity_type.findall("edm:Property", namespace):
            structure[entity_name]["properties"][prop.attrib["Name"]] = prop.attrib[
                "Type"
            ]

        for nav_prop in entity_type.findall("edm:NavigationProperty", namespace):
            structure[entity_name]["navigation_properties"][nav_prop.attrib["Name"]] = {
                "Relationship": nav_prop.attrib["Relationship"],
                "ToRole": nav_prop.attrib["ToRole"],
                "FromRole": nav_prop.attrib["FromRole"],
            }

    return structure


# Extract metadata structure
metadata_structure = extract_metadata_structure("metadata.xml")


# Function to map XML structure to metadata
def map_to_metadata(xml_structure, metadata_structure):
    mapped_structure = defaultdict(dict)

    for path, attributes in xml_structure.items():
        entity_name = path.split("/")[-1]
        if entity_name in metadata_structure:
            mapped_structure[entity_name]["attributes"] = attributes
            mapped_structure[entity_name]["metadata"] = metadata_structure[entity_name]

    return mapped_structure


# Extract structures from all XML files and map to metadata
mapped_structures = [
    map_to_metadata(extract_structure(file), metadata_structure) for file in xml_files
]


# Compare the mapped structures
def compare_mapped_structures(mapped_structures):
    comparison = defaultdict(list)

    all_entities = set()
    for structure in mapped_structures:
        all_entities.update(structure.keys())

    for entity in all_entities:
        for idx, structure in enumerate(mapped_structures):
            if entity in structure:
                comparison[entity].append(structure[entity])
            else:
                comparison[entity].append(None)

    return comparison


comparison = compare_mapped_structures(mapped_structures)

# Save the comparison result to a file
with open("comparison_result.txt", "w") as f:
    for entity, structures in comparison.items():
        f.write(f"Entity: {entity}\n")
        for idx, structure in enumerate(structures):
            if structure:
                f.write(f"  File {idx+1}:\n")
                f.write(f"    Attributes: {structure['attributes']}\n")
                f.write(f"    Properties: {structure['metadata']['properties']}\n")
                f.write(
                    f"    Navigation Properties: {structure['metadata']['navigation_properties']}\n"
                )
            else:
                f.write(f"  File {idx+1}: Not present\n")
        f.write("\n")
