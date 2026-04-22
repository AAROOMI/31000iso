import json
import urllib.request
import urllib.parse
from google.oauth2 import service_account
from google.auth.transport.requests import Request

def get_access_token():
    print("Authenticating with Service Account...")
    credentials = service_account.Credentials.from_service_account_file(
        'firebase-admin-key.json',
        scopes=['https://www.googleapis.com/auth/firebase', 'https://www.googleapis.com/auth/datastore', 'https://www.googleapis.com/auth/cloud-platform']
    )
    request = Request()
    credentials.refresh(request)
    return credentials.token

def deploy_rules():
    project_id = "metaworks-7cfc5"
    try:
        token = get_access_token()
    except Exception as e:
        print("Failed to authenticate:", e)
        return
    
    print("Reading local firestore.rules...")
    with open('firestore.rules', 'r') as f:
        rules_content = f.read()
        
    ruleset_payload = {
        "source": {
            "files": [
                {
                    "name": "firestore.rules",
                    "content": rules_content
                }
            ]
        }
    }
    
    print("Uploading Ruleset to Firebase Servers...")
    # 1. Create a ruleset
    req1 = urllib.request.Request(
        f"https://firebaserules.googleapis.com/v1/projects/{project_id}/rulesets",
        data=json.dumps(ruleset_payload).encode('utf-8'),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    
    try:
        res1 = urllib.request.urlopen(req1)
        ruleset_data = json.loads(res1.read().decode('utf-8'))
        ruleset_name = ruleset_data['name']
        print(f"✅ Ruleset Uploaded: {ruleset_name}")
    except Exception as e:
        print("Error creating ruleset:", e.read().decode('utf-8') if hasattr(e, 'read') else str(e))
        return

    # 2. Update the release for the specific database
    release_name = f"projects/{project_id}/releases/cloud.firestore/ai-studio-c10a8a6c-9288-4c91-86d0-d99b18b061ad"
    update_release_payload = {
        "release": {
            "name": release_name,
            "rulesetName": ruleset_name
        }
    }
    
    req2 = urllib.request.Request(
        f"https://firebaserules.googleapis.com/v1/{release_name}",
        data=json.dumps(update_release_payload).encode('utf-8'),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        method="PATCH"
    )
    
    try:
        res2 = urllib.request.urlopen(req2)
        print("🎉 Success! Firebase is now secured and Admin keys are unlocked!")
    except Exception as e:
        # If the release doesn't exist yet, we must POST to create it instead of PATCHing
        e_msg = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
        if "NOT_FOUND" in e_msg:
            print("Release not found. Creating a new release...")
            req3 = urllib.request.Request(
                f"https://firebaserules.googleapis.com/v1/projects/{project_id}/releases",
                data=json.dumps(update_release_payload["release"]).encode('utf-8'),
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            try:
                res3 = urllib.request.urlopen(req3)
                print("🎉 Success! Firebase rules created and activated!")
            except Exception as e3:
                print("Error creating release:", e3.read().decode('utf-8') if hasattr(e3, 'read') else str(e3))
        else:
            print("Error updating release:", e_msg)

if __name__ == "__main__":
    deploy_rules()
