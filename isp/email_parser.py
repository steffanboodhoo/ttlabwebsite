#!/usr/bin/python

import email
import time
import sqlite3
from collections import defaultdict
import sys
import re
import smtplib
from email.mime.text import MIMEText as text

address = 'labttsite@gmail.com'
password = 'adminlab1'

email_server = smtplib.SMTP("smtp.gmail.com",587)
email_server.ehlo()
email_server.starttls()
email_server.login(address, password )

NUMBER_OF_NOMINATIONS_NEEDED = 1

nomination_nominee_message = """
Welcome to Our ISP Broadband Performance Monitoring Trusted Users Group
Members of this group can submit performance data as outlined below and
view the performance indicator dashboard at http://lab.tt/isps

To submit data, please send an email to isp-perf@lab.tt with the subject "ISP Performance".
The body must contain two lines:
Line 1 is either Blink, Flow, Digicel, Massy or Greendot
Line 2 is the download rate achieved (in kbps using any speed check application) divided by the monthly cost of your plan (in TT$).
Please use a target server in Miami, take your measurement at about 8pm on a weekday and average over 3 or more tests.
To nominate users to this group send email to isp-perf@lab.tt with subject "nominations".
The body should contain one email address per line.
Once a user receives {0} recommendations they become trusted.

We thank you for your participation.

-TTLAB

""".format(NUMBER_OF_NOMINATIONS_NEEDED)

nomination_nominator_t_message = """
    Your nomination of {0} has been recorded.
"""

nomination_nominator_b_message = """
    You have already nominated {0}.
"""

data_received_message = """
    Your data of {0} and ${1} for the ISP {2} has been received and recorded.
"""

format_changed_message = """
    Your value of {0} for the ISP {1} has been received. However, our format has changed.
    From now on, the Mbps achivied should and the price paid per month be sent.
    The new format is as follows:
    Line #1: ISP Name (Digicel, Greendot, Flow, Blink, or Massy)
    Line #2: Achived rate (in Mbps) using a Miami server as the target
             on speedtest.net
    Line #3: The price paid monthly for your connection

    We thank you for your participation in this dashboard

    -- TTLAB
"""




email_string = sys.stdin.read()

try:
    f = open('/var/www/html/lab/ttlabwebsite/isp/email_log.txt', 'a')
    f.write(email_string + '\n')
    f.close()
except:
    pass

email_obj = email.message_from_string(email_string)

pattern = '([^<\s:>]+@[^>\s<:]+)'
sender = re.search(pattern, email_obj.get('From').upper()).group(1)
subject = email_obj.get('Subject').upper()


conn = sqlite3.connect('/var/www/html/lab/ttlabwebsite/isp/data.db')
cursor = conn.execute('SELECT EMAIL FROM SENDERS;')
senders = set(map(lambda x: x[0], cursor.fetchall()))


def insert_nomination(conn, nominee_raw, nominator):
    msg = nomination_nominator_b_message
    nominee_res = re.search(pattern, nominee_raw.upper())
    if not nominee_res:
        return ''
    nominee = nominee_res.group(1)
    query = "SELECT NOMINATOR FROM NOMINATIONS WHERE NOMINEE='{0}';".format(nominee)
    ins_query = "INSERT INTO NOMINATIONS(NOMINEE, NOMINATOR) VALUES('{0}','{1}');".format(nominee, nominator)
    cursor = conn.execute(query).fetchall()
    nominators = set(map(lambda x: x[0], cursor))
    if nominator not in nominators:
        conn.execute(ins_query)
        if nominee in senders:
            msg = "{0} has already been nominated".format(nominee)
        elif len(nominators) == NUMBER_OF_NOMINATIONS_NEEDED:
            msg = "Your supplied nominee of {0} already been successfully nominated".format(nominee)
        elif len(nominators) + 1 == NUMBER_OF_NOMINATIONS_NEEDED:
            senders_ins = "INSERT INTO SENDERS VALUES('{0}')".format(nominee)
            conn.execute(senders_ins)
            body = text(nomination_nominee_message)
            body['Subject'] = 'Nominations Accepted'
            body['To'] = nominee
            body['From'] = address
            email_server.sendmail(address, nominee, body.as_string())
            msg = nomination_nominator_t_message.format(nominee)
            msg += 'They are now a trusted supplier of data'
        else:
            msg = nomination_nominator_t_message.format(nominee)
            msg += 'They require {0} more nomination(s)'.format(NUMBER_OF_NOMINATIONS_NEEDED - len(nominators))
    else:
        msg = 'You have already nominated {0}.'.format(nominee)
    return msg

print sender, subject
print senders

msg = """You have not been authorized to use this system"""
subj = 'Authentication Failed'

def compute_metric(value, price):
    return float(value) * 100 / (float(price) - 100)


if sender in senders:
    subj = 'Incorrect use of isp-perf@lab.tt'
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
        subj = 'Re:' + subject
        isp = raw[0].upper()
        value = float(raw[1].strip())
        print isp, value
        try:
            price = float(raw[2].strip())
            metric_val = str(compute_metric(value, price))
            if isp in ['BLINK', 'FLOW', 'MASSY', 'GREENDOT', 'DIGICEL']:
                st = 'INSERT OR REPLACE INTO DATA(EMAIL, ISP, DATERECOREDED, METRIC, rate, price) VALUES'
                vec = "('{0}', '{1}', CURRENT_DATE, {2}, {3}, {4})".format(sender, isp, metric_val, str(value), str(price))
                st += vec + ';'
                print st
                conn.execute(st)
                conn.commit()
                msg = data_received_message.format(value, price,  isp)
        except:
            msg = (format_changed_message).format(value, isp)
    elif "NOMINATION" in subject:
        subj = 'Re:' + subject
        msgs = []
        for nominee in raw:
            if nominee not in senders:
                msgs.append(insert_nomination(conn, nominee, sender))
        msg = '\n'.join(msgs)
        conn.commit()

email_body = text(msg)
email_body['Subject'] = subj
email_body['From'] = address
email_body['To'] = sender

email_server.sendmail(address, sender, email_body.as_string())
email_server.close()

conn.close()
