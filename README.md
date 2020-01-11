## What it does
Clip It allows you to find the highlights of your favorite streams. Given the URL for a video, it finds the highlights by tracking two key metrics:

1) Local spikes in chat message frequency (i.e. the equivalent of volume level in Twitch chat). We keep a rolling median of the number of messages sent in consecutive 30-second windows; and window that is significantly higher than the local median could be of interest!

2) Sentiment magnitude of the chat messages. To detect this, we used Google Cloud Platform's natural language processing-based sentiment analysis API, which returns sentiment score (i.e. positive or negative) and sentiment magnitude (how positive or negative). We focused on just sentiment magnitude, as that will pick out an interesting and wide variety of events, from controversial to exciting moments! Once again, we track local spikes in sentiment magnitude compared to the rolling median to find clips of interest.

We then look at the product of the differences between each metric and its rolling median--the clips with the highest value for this number therefore have large spike in both metrics. We return the timestamps with the highest values to make our highlight reel!

![Image of Data Analysis](https://github.com/Huang-Vincent/ClipIt/blob/master/annotated.png)

## How we built it
We get Twitch chat data with the twitch-python API, and then analyze it with GCP's NLP API as well as our own statistical algorithm in Python. We host the backend server with Python + Flask. The frontend is in HTML + Javascript, connected to backend with Socket IO.
