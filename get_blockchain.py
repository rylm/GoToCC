import requests
import json

blocks = []

i = 1
resp = ''
while resp != 'null':
	r = requests.get('http://127.0.0.1:1488/api/explorer/v1/blocks/{}'.format(i))
	resp = r.text
	if resp == 'null':
		continue
	blocks.append(r.json())

print(blocks)
