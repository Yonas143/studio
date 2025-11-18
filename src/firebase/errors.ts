
export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
    public readonly context: SecurityRuleContext;
    
    constructor(context: SecurityRuleContext) {
        const { path, operation } = context;
        const message = `FirestoreError: Missing or insufficient permissions: 
The following request was denied by Firestore Security Rules:
{
  "auth": {
    "uid": "...",
    "token": {
       "..."
    }
  },
  "method": "${operation}",
  "path": "/databases/(default)/documents/${path}"
}
`;
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;

        // This is to ensure the stack trace is correct
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FirestorePermissionError);
        }
    }
}
