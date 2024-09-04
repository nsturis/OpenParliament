import re


def convert_to_drizzle(prisma_schema):
    drizzle_schema = []
    current_model = None

    for line in prisma_schema.split("\n"):
        if line.strip().startswith("model"):
            if current_model:
                drizzle_schema.append("})\n")
            model_name = line.split()[1]
            drizzle_schema.append(
                f"export const {model_name.lower()} = pgTable('{model_name}', {{"
            )
            current_model = model_name
        elif line.strip().startswith("}"):
            if current_model:
                drizzle_schema.append("})\n")
                current_model = None
        elif "  " in line and current_model:
            field = line.strip().split()
            if len(field) >= 2:
                field_name, field_type = field[0], field[1]
                drizzle_line = f"  {field_name}: "

                if field_type == "String":
                    drizzle_line += "varchar"
                elif field_type == "Int":
                    drizzle_line += "integer"
                elif field_type == "BigInt":
                    drizzle_line += "bigint"
                elif field_type == "Boolean":
                    drizzle_line += "boolean"
                elif field_type == "DateTime":
                    drizzle_line += "timestamp"
                else:
                    drizzle_line += "text"

                if "@id" in line:
                    drizzle_line += ".primaryKey()"
                elif "?" not in line:
                    drizzle_line += ".notNull()"

                drizzle_schema.append(drizzle_line + ",")

        elif line.strip().startswith("@relation"):
            relation = re.search(r"@relation\((.*?)\)", line)
            if relation:
                rel_parts = relation.group(1).split(",")
                fields = re.search(r"fields: \[(.*?)\]", rel_parts[0]).group(1)
                references = re.search(r"references: \[(.*?)\]", rel_parts[1]).group(1)
                drizzle_schema.append(
                    f"  {fields}: integer.references(() => {references}),"
                )

    if current_model:
        drizzle_schema.append("})\n")

    return "\n".join(drizzle_schema)


# Read the Prisma schema

with open("prisma/schema.prisma", "r") as file:
    prisma_schema = file.read()

# Convert to Drizzle
drizzle_schema = convert_to_drizzle(prisma_schema)

# Save the result to a file
with open("drizzle.py", "w") as file:
    file.write(drizzle_schema)
