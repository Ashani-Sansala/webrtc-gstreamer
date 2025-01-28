#!/bin/bash

# path to the video file
VIDEO_PATH="../client/sample_video_h264.mp4"

if [ ! -f "$VIDEO_PATH" ]; then
    echo "Error: Video file not found at $VIDEO_PATH"
    exit 1
fi

# GStreamer pipeline to broadcast the video
gst-launch-1.0 \
    filesrc location="$VIDEO_PATH" ! decodebin ! videoconvert ! queue ! vp8enc ! rtpvp8pay ! udpsink host=127.0.0.1 port=5000
