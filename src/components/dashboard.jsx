import { useState, useEffect } from 'react';
import { Authorize } from './authorize';
import { auth } from '../config/firebase';
import { ModeToggle } from './mode-toggle';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar";

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
          } else {
            setUser(null);
          }
        });
    
        return () => unsubscribe();
      }, []);
    return(
        <div className='App'>
        <div className='Dashboard'>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Dashboard</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <ModeToggle/>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Add <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Remove <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

  
            <MenubarMenu>
              <MenubarTrigger>Account</MenubarTrigger>
              <MenubarContent>
                {user ? (
                  <>
                    <MenubarItem inset onClick={() => auth.signOut()}>Sign Out</MenubarItem>
                  </>
                ) : (
                  <>
                    <MenubarItem inset>Sign In With Google</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem inset>Sign Up</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem inset>Sign In</MenubarItem>
                  </>
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <div className="mt-4">
            {!user ? (
              <Authorize />
            ) : (
              <div>
                {/* Your authenticated content goes here */}
                <p>Welcome, {user.displayName}!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    )
};

export default Dashboard;