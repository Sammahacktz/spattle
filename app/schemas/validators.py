def parse_comma_string(v: str | None) -> list[int]:
    if not v:
        return []
    return [int(number) for number in v.split(",")]
