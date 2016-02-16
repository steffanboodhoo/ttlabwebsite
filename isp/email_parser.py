#!/usr/bin/python

import email
import time
import sqlite3
from collections import defaultdict
import sys
import re
import smtplib

address = 'labttsite@gmail.com'
password = 'adminlab1'

email_server = smtplib.SMTP("smtp.gmail.com",587)
email_server.login(address, password )

nomination_nominee_message = """
    You have been nominated as a source of ISP performance information.
    To submit data, please send an email to isp-perf@lab.tt with the subject
    "ISP Performance" and the body containing two lines: ISP Name (one of Blink,
    Flow, Digicel, Massy, or Greendot), and Achieved Rate / Cost. To measure
    achieved rate, please use the test at speedtest.net and choose the Miami
    Line server

    To sumbit a nomination, please send an email to isp-perf@lab.tt with the
    subject "Nomination" and the body containing on each line an email
    address for the nominee.
"""

nomination_nominator_t_message = """
    Your nomination of {0} has been successful.
"""

nomination_nominator_b_message = """
    You have already nominated {0}.
"""

data_received_message = """
    Your data of {0} for the ISP {1} has been received and recorded
"""


NUMBER_OF_NOMINATIONS_NEEDED = 2

email_string = sys.stdin.read()
email_obj = email.message_from_string(email_string)

pattern = '([^<\s:]+@[^>\s]+)'
sender = re.search(pattern, email_obj.get('From').upper()).group(1)
subject = email_obj.get('Subject').upper()


conn = sqlite3.connect('/var/www/html/lab/ttlabwebsite/isp/data.db')
cursor = conn.execute('SELECT EMAIL FROM SENDERS;')
senders = set(map(lambda x: x[0], cursor.fetchall()))


def insert_nomination(conn, nominee_raw, nominator):
    msg = nomination_nominator_b_message
    nominee = re.search(pattern, nominee_raw.upper()).group(1)
    query = "SELECT NOMINATOR FROM NOMINATIONS WHERE NOMINEE='{0}';".format(nominee)
    ins_query = "INSERT INTO NOMINATIONS(NOMINEE, NOMINATOR) VALUES('{0}','{1}');".format(nominee, nominator)
    cursor = conn.execute(query).fetchall()
    nominators = set(map(lambda x: x[0], cursor))
    if nominator not in nominators:
        conn.execute(ins_query)
        if len(nominators) + 1 == NUMBER_OF_NOMINATIONS_NEEDED:
            senders_ins = "INSERT INTO SENDERS VALUES('{0}')".format(nominee)
            conn.execute(senders_ins)
        msg = nomination_nominator_t_message
    return msg.format(nominee)

print sender, subject
print senders

msg = """You have not been authorized to use this system"""

if sender in senders:
    msg = """The message has been incorrectly formated"""
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
            msg = data_received_message.format(value, isp)
    elif "NOMINATION" in subject:
        for nominee in raw:
            if nominee not in senders:
                msg = insert_nomination(conn, nominee, sender)
        conn.commit()


email_server.send(address, sender, msg)

conn.close()
