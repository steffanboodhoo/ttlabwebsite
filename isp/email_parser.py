#!/usr/bin/python

import email
import time
import sqlite3
from collections import defaultdict
import sys
import re



email_string = sys.stdin.read()
email_obj = email.message_from_string(email_string)

pattern = '([^<\s]+@[^>\s]+)'
sender = re.search(pattern, email_obj.get('From').upper()).group(1)
subject = email_obj.get('Subject').upper()


conn = sqlite3.connect('/var/www/html/lab/ttlabwebsite/isp/data.db')
cursor = conn.execute('SELECT EMAIL FROM SENDERS;')
senders = set(map(lambda x: x[0], cursor.fetchall()))



print sender, subject
print senders

if sender in senders and 'ISP' in subject:
    print 'Authenicated ', sender
    #contents = email_obj.get_payload()
    raw = ''
    if email_obj.is_multipart():
        print 'is multipart'
        p1 = email_obj.get_payload()
        raw = p1[0].get_payload().split()
    else:
        print 'is not multipart'
        raw = email_obj.get_payload().split()
    print 'This is the raw:'
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
