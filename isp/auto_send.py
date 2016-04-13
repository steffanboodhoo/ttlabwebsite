#!/usr/bin/python

import smtplib
from email.mime.text import MIMEText as text
import sqlite3
import argparse
import json

address = 'labttsite@gmail.com'
password = 'adminlab1'

email_server = smtplib.SMTP("smtp.gmail.com",587)
email_server.ehlo()
email_server.starttls()
email_server.login(address, password)

conn = sqlite3.connect('/var/www/html/lab/ttlabwebsite/isp/data.db')
cursor = conn.execute('SELECT EMAIL FROM SENDERS;')
senders = set(map(lambda x: x[0], cursor.fetchall()))
parser = argparse.ArgumentParser(description="The script sends an email to all trusted users")
parser.add_argument('filename', help='The location of the file containg the email')
parser.add_argument('filetype', help='json or txt')

args = parser.parse_args()

filetype = args.filetype.strip().upper()
filename = args.filename

subject = 'ISP Performance Dashboard Notification'
message = ''
file_handle = open(filename, 'r')

if filetype == 'JSON':
    data = json.load(file_handle)
    subject = data['subject']
    message = data['message']
else:
    lines = file_handle.readlines()
    lines = filter(lambda x: len(x.strip()) > 0, lines)
    subject = lines[0]
    message = '\n'.join(lines[1 : ])
file_handle.close()


def process_email(sender_addr, message, subject):
    body = text(message)
    body['Subject'] = subject
    body['From'] = address
    body['To'] = sender_addr
    return body

def send_email(sender_addr, message, subject):
    body = process_email(sender_addr, message, subject)
    email_server.sendmail(address, sender_addr, body.as_string())

for sender in senders:
    send_email(sender, message, subject)
email_server.close()
