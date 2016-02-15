#!/usr/bin/python

import email
import time
import sqlite3
from collections import defaultdict
import sys
import re

NUMBER_OF_NOMINATIONS_NEEDED = 2

email_string = sys.stdin.read()
email_obj = email.message_from_string(email_string)

pattern = '([^<\s]+@[^>\s]+)'
sender = re.search(pattern, email_obj.get('From').upper()).group(1)
subject = email_obj.get('Subject').upper()


conn = sqlite3.connect('/var/www/html/lab/ttlabwebsite/isp/data.db')
cursor = conn.execute('SELECT EMAIL FROM SENDERS;')
senders = set(map(lambda x: x[0], cursor.fetchall()))


def insert_nomination(conn, nominee, nominator):
    query = "SELECT NOMINATOR FROM NOMINATIONS WHERE NOMINEE='{0}';".format(nominee)
    ins_query = "INSERT INTO NOMINATIONS(NOMINEE, NOMINATOR) VALUES('{0}','{1}');".format(nominee, nominator)
    cursor = conn.execute(query).fetchall()
    nominators = set(map(lambda x: x[0], cursor))
    if nominator not in nominators:
        conn.execute(ins_query)
        if len(nominators) + 1 == NUMBER_OF_NOMINATIONS_NEEDED:
            senders_ins = "INSERT INTO SENDERS VALUES('{0}')".format(nominee)
            conn.execute(senders_ins)

print sender, subject
print senders

if sender in senders:
    print 'Authenicated ', sender
    #contents = email_obj.get_payload()
    raw = ''
    if email_obj.is_multipart():
        print 'is multipart'
        p1 = email_obj.get_payload()
        raw = p1[0].get_payload(decode=True).split()
    else:
        print 'is not multipart'
        raw = email_obj.get_payload().split()
    print 'This is the raw:'
    print raw
    if 'ISP' in subject:
        isp = raw[0].upper()
        value = raw[1]
        print isp, value
        if isp in ['BLINK', 'FLOW', 'MASSY', 'GREENDOT', 'DIGICEL']:
            st = 'INSERT OR REPLACE INTO DATA VALUES'
            vec = "('{0}', '{1}', CURRENT_DATE, {2})".format(sender, isp, value)
            st += vec + ';'
            print st
            conn.execute(st)
            conn.commit()
    elif "NOMINATION" in subject:
        for nominee in raw:
            if nominee not in senders:
                insert_nomination(conn, nominee, sender)
        conn.commit()





conn.close()
