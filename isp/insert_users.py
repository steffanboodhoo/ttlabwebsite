import sqlite3
import sys


connection_string = 'data.db'

input_data = sys.stdin.read()
email_addrs = input_data.strip().split()
email_addrs = map(lambda s: s.upper(), email_addrs)

base_stmnt = "INSERT INTO SENDERS VALUES('{0}');"

conn = sqlite3.connect(connection_string)

for email_addr in email_addrs:
    stmnt = base_stmnt.format(email_addr)
    conn.execute(stmnt)
