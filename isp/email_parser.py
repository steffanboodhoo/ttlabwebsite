#!/usr/bin/python

import email
import time
import sqlite3
from collections import defaultdict
import sys
import re



email_string = sys.stdin.read()
email_obj = email.message_from_string(email_string)

pattern = '([^<\s]+@[^>\s])'
sender = re.search(pattern, email_obj.get('From').upper())
subject = email_obj.get('Subject').upper()


conn = sqlite3.connect('data.db')
cursor = conn.execute('SELECT EMAIL FROM SENDERS;')
senders = set(map(lambda x: x[0], cursor.fetchall()))



print sender, subject

if sender in senders and 'ISP' in subject:
    print 'Authenicated ', sender
    contents = email_obj.get_payload()
    raw = ''
    if contents.is_multipart():
        p1 = contents.get_payload()
        raw = p1[0].split()
    else:
        raw = contents.get_payload().split()
    print raw
    isp = raw[0]
    value = raw[1]
    print isp, value
    st = 'INSERT OR REPLACE INTO DATA VALUES'
    vec = "('{0}', '{1}', CURRENT_DATE, {2})".format(sender, isp, value)
    st += vec + ';'
    print st
    conn.execute(st)
    conn.commit()


conn.close()
