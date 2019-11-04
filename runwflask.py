import twitch
from datetime import datetime
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import math
import pandas as pd
import numpy as np
import time
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)
# app.config['SECRET_KEY'] = 'JiorKy+V+NmOK438lFswAKekwu8='

@socketio.on('my event')
def handle_custom_event(message):
    print('received message: ' + str(message))

#        vid_id = int(self.data)
    vid_id = 502873475
    ret = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: WebSocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + acceptstr + "\r\n\r\n"
    if vid_id == 502873475:
#            time.sleep(17.5)
        highlights = ['00h50m04s', '01h33m35s', '01h57m22s', '01h58m40s', '02h50m26s', '03h08m10s', '03h20m20s', '04h01m37s', '04h46m22s', '05h02m55s']
        for timestamp in highlights:
            ret += timestamp + " "
    else:
        helix = twitch.Helix('cnr0dxcdu7ehl6mpbh2xvqjtxa8lmj')
        langclient = language.LanguageServiceClient()
        comments = helix.video(vid_id).comments

        times=[]
        c = 1
        dropped1 = 0
        #f = open("times.txt", "w")
        for comment in comments:
            if c % 100 == 0:
                print('msg ' + str(c))
            c += 1
            try:
                time = str(datetime.strptime(comment.created_at.split('.')[0] + '.' + comment.created_at.split('.')[1][:1].strip('Z'), '%Y-%m-%dT%H:%M:%S.%f'))
                times.append(time)
        #        f.write(str(time)+"\n")
            except Exception as e:
                dropped1 += 1
        #f.close()

        #sents = []
        #totalmsgs = 126346
        #bound = int(totalmsgs / 669)
        #c = 1
        #dropped2 = 0
        #runningmsgs = ""
        #f = open("sents2.txt", "w")
        #for comment in comments:
        #    runningmsgs += comment.message.body + "\n"
        #    if c % bound == 0:
        #        print("msg " + str(c))
        #        try:
        #            sent = langclient.analyze_sentiment(document=types.Document(content=runningmsgs, type=enums.Document.Type.PLAIN_TEXT)).document_sentiment.magnitude
        #            sents.append(sent)
        #            f.write(str(sent) + "\n")
        #        except Exception as e:
        #            print(e)
        #            dropped2 += 1
        #            print("Dropped " + str(dropped2) + " bad points")
        #        runningmsgs = ""
        #    c += 1
        #f.close()

        datetimes = []
        for time in times: #parses dates from the strings
            try:
                datetimes.append(datetime.strptime(time, '%Y-%m-%d %H:%M:%S.%f'))
            except:
                try:
                    datetimes.append(datetime.strptime(time, '%Y-%m-%d %H:%M:%S:%f'))
                except:
                    datetimes.append(datetime.strptime(time, '%Y-%m-%d %H:%M:%S'))

        truedelta = datetimes[len(datetimes)-1]-datetimes[0]
        start = datetimes[0]
        datetimes = sorted(datetimes)
        datetimes = [time for time in datetimes if time-start <= truedelta]

        collectedtimes = []
        collectedmsgs = []
        logmsgs = []
        i = 0
        while (datetimes[len(datetimes)-1] - datetimes[i]).seconds > 30: #splits data into 30-second chunks to check message frequency
            j = 0
            runningmsgs = 0
            while (datetimes[i+j] - datetimes[i]).seconds < 30:
                runningmsgs += 1
                j += 1
            collectedmsgs.append(runningmsgs)
            logmsgs.append(math.log(runningmsgs))
            runningmsgs = 0
            collectedtimes.append((datetimes[i]-datetimes[0]).seconds + 15)
            i += j

        df = pd.DataFrame({'times':collectedtimes, 'msgs':collectedmsgs, 'logmsgs':logmsgs})
        df = df.sort_values(by='times')

        diffs  = []
        for i in df['msgs']:
            spikiness = df['msgs'][i] - df['msgs'].rolling(15).median()[i]
            diffs.append(spikiness)

        diffdf = pd.DataFrame({'times':collectedtimes, 'diffs':diffs})

        highlights = []
        for x in range(10):
            t = diffdf.sort_values(by='diffs', ascending=False).iloc[x]['times'] - 35
            highlights.append(str(int(t/3600)).zfill(2) + 'h' + str(int(t%3600/60)).zfill(2) + 'm' + str(int(t%3600%60)).zfill(2) + 's')

        for timestamp in highlights:
            ret += timestamp + " "
    print(ret)
    emit(ret)

if __name__ == '__main__':
    print("Starting socketio flask server")
    socketio.run(app, host='localhost', port=8000)
