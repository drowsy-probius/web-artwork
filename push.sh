#!/bin/bash

MESSAGE_ARRAY=("8^8" ">_<" "*^*" "T^T" "OwO" "*3*" "🤔" "🤨" "❓" "❗" "⁉️" "X_X" "ꉂꉂ(ᵔᗜᵔ*)")
LENGTH=13
INDEX="$RANDOM % $LENGTH"
COMMIT_MESSAGE=$1

if [ -z "$COMMIT_MESSAGE" ]
then
  COMMIT_MESSAGE=${MESSAGE_ARRAY[$INDEX]}
fi

git config --global credential.helper store
git add .
git commit -m ${MESSAGE_ARRAY[$INDEX]}
git push