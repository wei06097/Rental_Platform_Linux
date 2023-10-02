: '
** 使用方式 **
功能
    - 建立前端的 docker image
指令
    - sh DockerBuild.sh <image 名稱> <Django url> <Django ws url> <mapbox token> <導航後端 url>
    - 第 2, 3, 4, 5 參數可以省略
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
if [ -z "$5" ]; then
    S5="http://192.168.244.130:6000"
else
    S5="$5"
fi

# 指令
docker build \
    --build-arg API_URL="$S2"  \
    --build-arg WS_URL="$S3"  \
    --build-arg MAPBOX_TOKEN="$S4"  \
    --build-arg NAVIGATION_API_URL="$S5"  \
    -t $1 .
docker image prune -f
