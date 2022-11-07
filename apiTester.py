import requests as rq
import re

URL = "http://localhost:3001"
#QUERY = "?uid=something_something"

# service 1 _id 63694a76069a6e37d0afa78a
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
    header = { "Content-Type":"application/json"}
    url = URL + "/services"
    res = rq.get(url, headers=header)
    result = res.json()
    for data in result["data"]:
        print(data["title"])

def POST():
    header = { "Content-Type":"application/json", "uid":"someUsersUid", "service_id":"63694a76069a6e37d0afa78a"}
    body ={ "review":"Nice experience. No pain. Didn't feel any trouble"  }
    url = URL + "/comments"
    res = rq.post(url, headers=header, json=body)
    result = res.json()
    print(result)


POST()
