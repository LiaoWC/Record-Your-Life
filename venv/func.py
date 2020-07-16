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
