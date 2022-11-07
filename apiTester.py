import requests as rq
import re

URL = "http://localhost:3001"
#QUERY = "?uid=something_something"

# service 1 _id 63694a76069a6e37d0afa78a
# cooment 1 _id 63695310615123a6b5c70cda
'''
def GET_TOKEN():
    header = { "Content-Type":"application/json", "uid":"something_something"   }
    url = URL + "/auth"
    res = rq.get(url,  headers=header)
    result = res.json()
    token = result["authtoken"]
    #print("Found Token", result["authtoken"])
    #forgedToken = re.sub(r"^.", "X", result["authtoken"])
    #print("Forged Token", forgedToken)
    GET(token)
'''

def GET():
    header = { "Content-Type":"application/json", "service_id": "63694a76069a6e37d0afa78a"}
    url = URL + "/comments"
    res = rq.get(url, headers=header)
    result = res.json()
    print(result)

def POST():
    header = { "Content-Type":"application/json", "uid":"someUsersUid", "service_id":"63694a76069a6e37d0afa78a"}
    body ={ "review":"Nice experience. No pain. Didn't feel any trouble"  }
    url = URL + "/comments"
    res = rq.post(url, headers=header, json=body)
    result = res.json()
    print(result)

def DELETE():
    header = { "Content-Type":"application/json", "uid":"someUsersUid", "comment_id":"63695310615123a6b5c70cda"}
    url = URL + "/comment"
    res = rq.delete(url, headers=header )
    result = res.json()
    print(result)

#POST()
#POST()
GET()

