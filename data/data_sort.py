import json
from datetime import datetime

# Used for sorting dates joined for staff and rank for alumni :)

# filename = "adjunct_members_data.json"
filename = "alumni"

with open(filename + ".json") as json_file:
    users = json.load(json_file)

json_file.close()

# for key in users.keys():
#     users[key]['join_date'] = users[key]['join_date'].replace('/', '-')

# users_sorted_dates = {k: v for k, v in sorted(users.items(), key=lambda fs: datetime.strptime(fs[1]['join_date'], "%d-%m-%Y"))}

users_sorted_dates = {k: v for k, v in sorted(users.items(), key=lambda fs: fs[1]['rank'])}

print(type(users_sorted_dates))

with open(filename + "2.json", 'w') as json_file:
    json.dump(users_sorted_dates, json_file)

json_file.close()
