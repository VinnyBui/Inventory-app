import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { auth } from '../config/firebase';


export const Auth = () => {
    return (
        <div>
            <Input type="email" placeholder="Email" />
        </div>
    );
};

