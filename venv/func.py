import datetime

def solve_apostrophe(old_str):
    newStr = ""
    for i in old_str:
        if i == "'":
            newStr = newStr + i + i
        else:
            newStr = newStr + i
    return newStr


def turn_json_array_string_into_list(target):
    target = target.lstrip('[')
    target = target.rstrip(']')
    tagsList = target.split(',')
    resList = []
    for item in tagsList:
        newItem = item.lstrip('\"')
        newItem = newItem.rstrip('\"')
        resList.append(solve_apostrophe(newItem))
    return resList

# reference: https://code-maven.com/serialize-datetime-object-as-json-in-python
def date_to_string_converter(d):
    if isinstance(d,datetime.date):
        return d.__str__()