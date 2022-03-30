"use strict";

import {Request, Response} from "express";

let jwt = require("jsonwebtoken"),
    sharedSecret = "jeeves",
    issuer = "jeeves.com";

const verifyTokenV2 = (req: Request, res: Response, next: Function) => {
    const {swagger} = req as any;
    if(swagger.security && swagger.security.length){
        const token = req.headers['authorization'];
        if(!token || !token.length || !token.startsWith('Bearer')){
            return sendError();
        }
        let tokenString = token.split(" ")[1];
        const authCache = req.app.get('authCache');
        const cacheMem = authCache.get(tokenString)
        if(!cacheMem){
            return sendError();
        }
        const currentScopes = swagger.operation['x-security-scopes'];
        jwt.verify(tokenString, sharedSecret, function(
            verificationError: Error,
            decodedToken: any
        ) {
            if(verificationError == null &&
                Array.isArray(currentScopes) &&
                decodedToken &&
                decodedToken.user.role) {
                    let roleMatch = currentScopes.indexOf(decodedToken.user.role) !== -1,
                    currentTime = new Date(),
                    issuerMatch = decodedToken.iss == issuer,
                    expirationTime = new Date(decodedToken.expiration);

                if (roleMatch && issuerMatch && expirationTime > currentTime) {
                    // @ts-ignore
                    req.auth = decodedToken;
                    next();
                } else {
                    return sendError();
                }
            }
        });
    } else {
        next();
        return;
    }

    function sendError() {
        // @ts-ignore
         return res.status(403).json({ message: "Error: Access Denied" })
    }
}

const decodeToken = function(token: string, callback: Function) {
  if (token && token.indexOf("Bearer ") == 0) {
    var tokenString = token.split(" ")[1]
    jwt.verify(tokenString, sharedSecret, function(
      verificationError: Error,
      decodedToken: any
    ) {
      if (!verificationError) {
        return callback(decodedToken);
      }
      return callback(verificationError);
    });
  } else {
    return callback({
      name: "JsonWebTokenError",
      message: "jwt missing"
    });
  }
};

const issueToken = function(username: string, role: string, id: string, expiration: string) {
  let token = jwt.sign(
    {
      user: {
        id: id,
        email: username,
        role: role,
      },
      iss: issuer,
      expiration,
    },
    sharedSecret
  );
  return token;
};

export default {
    issueToken,
    decodeToken,
    verifyTokenV2
}