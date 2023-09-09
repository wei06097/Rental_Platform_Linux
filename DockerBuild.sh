: '
** 使用方式 **
功能
    - 建立前端的 docker image
指令
    - sh DockerBuild.sh <image name> <api url> <ws url> <mapbox token>
    - 第 2, 3, 4 參數可以省略
'

# 判斷參數
if [ -z "$2" ]; then
    S2="http://192.168.244.130:4000"
else
    S2="$2"
fi
if [ -z "$3" ]; then
    S3="ws://192.168.244.130:4000"
else
    S3="$3"
fi
if [ -z "$4" ]; then
    S4="pk.eyJ1IjoicGVuaXNhbjM4NSIsImEiOiJjbGtxaDd6a3MxM2FqM2Rwcm5pNGNjaXowIn0.1QaQ6qLmk3RUtaV5ljzE5w"
else
    S4="$4"
fi

# 指令
docker build \
    --build-arg API_URL="$S2"  \
    --build-arg WS_URL="$S3"  \
    --build-arg MAPBOX_TOKEN="$S4"  \
    -t $1 .
docker image prune -f
