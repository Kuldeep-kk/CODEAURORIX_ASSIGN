import json
import sqlite3
import struct
import sys

# Database setup
db = sqlite3.connect('hyperlinks.db')
cursor = db.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS hyperlinks
    (site TEXT, link TEXT, count INTEGER, PRIMARY KEY (site, link))
''')
db.commit()

def send_message(message):
    encoded_message = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('I', len(encoded_message)))
    sys.stdout.buffer.write(encoded_message)
    sys.stdout.flush()

def receive_message():
    text_length_bytes = sys.stdin.buffer.read(4)
    if len(text_length_bytes) == 0:
        sys.exit(0)
    text_length = struct.unpack('I', text_length_bytes)[0]
    text = sys.stdin.buffer.read(text_length).decode('utf-8')
    return json.loads(text)

while True:
    message = receive_message()
    if message.get('action') == 'logLink':
        cursor.execute('''
            INSERT INTO hyperlinks (site, link, count) VALUES (?, ?, 1)
            ON CONFLICT(site, link) DO UPDATE SET count = count + 1
        ''', (message['site'], message['link']))
        db.commit()
        send_message({'success': True})
