set -e

if [ -d "./dist" ]; then
  rm -rf ./dist
fi
mkdir ./dist

tsc

find dist/navigation -name "*.d.ts" |xargs rm -rf
cp package.json dist/navigation/package.json
touch dist/navigation/build-time_$(date "+%Y-%m-%d_%H.%M.%S")
