import re


def read_file(file_path):
    with open(file_path, "r") as file:
        return file.read()


def extract_tables(content):
    return re.findall(r'export const (\w+) = pgTable\("(\w+)"', content)


def extract_relations(content):
    return re.findall(r"export const (\w+)Relations = relations\((\w+),", content)


def compare_schemas(schema_content, relations_content):
    schema_tables = extract_tables(schema_content)
    relation_tables = extract_relations(relations_content)

    schema_table_names = set(table[0] for table in schema_tables)
    relation_table_names = set(table[0] for table in relation_tables)

    print("Tables in schema but not in relations:")
    print(schema_table_names - relation_table_names)

    print("\nTables in relations but not in schema:")
    print(relation_table_names - schema_table_names)

    print("\nMatching tables:")
    for schema_table, schema_name in schema_tables:
        for relation_table, relation_name in relation_tables:
            if schema_table == relation_table:
                if schema_name != relation_name:
                    print(
                        f"Mismatch: {schema_table} (Schema: {schema_name}, Relation: {relation_name})"
                    )
                else:
                    print(f"Match: {schema_table}")


def main():
    schema_content = read_file("server/database/schema.ts")
    relations_content = read_file("server/database/relations.ts")

    compare_schemas(schema_content, relations_content)


if __name__ == "__main__":
    main()
