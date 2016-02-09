#!/usr/bin/python


import sqlite3
import sys


connection_string = 'data.db'

input_data = sys.argv[1 : ]
email_addrs = map(lambda s: s.upper(), input_data)

print email_addrs

base_stmnt = "INSERT INTO SENDERS VALUES('{0}');"

conn = sqlite3.connect(connection_string)

for email_addr in email_addrs:
    stmnt = base_stmnt.format(email_addr)
    conn.execute(stmnt)
    conn.commit()
