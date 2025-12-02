#!/bin/bash
cd /home/kavia/workspace/code-generation/claim-audit-invoice-processor-43248/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

