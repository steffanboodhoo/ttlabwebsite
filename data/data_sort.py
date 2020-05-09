import json
from datetime import datetime

with open('adjunct_members_data.json') as json_file:
    users = json.load(json_file)

json_file.close()

for key in users.keys():
    users[key]['join_date'] = users[key]['join_date'].replace('/', '-')

users_sorted_dates = {k: v for k, v in sorted(users.items(), key=lambda fs: datetime.strptime(fs[1]['join_date'], "%d-%m-%Y"))}

print(type(users_sorted_dates))

with open('adjunct_members_data2.json', 'w') as json_file:
    json.dump(users_sorted_dates, json_file)

json_file.close()
