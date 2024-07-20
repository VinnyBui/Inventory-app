import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { ModeToggle } from './mode-toggle';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from './breadCrumbs';
import {
  CircleUser,
  Home,
  Menu,
  Package,
  Package2,
  Search,
  ActivityIcon,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [inventoryExpanded, setInventoryExpanded] = useState(false);
  const [shippingExpanded, setShippingExpanded] = useState(false);
  const [receivingExpanded, setReceivingExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setSelectedTab(path || 'dashboard');
  }, [location]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/authorize');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSelection = (item) => {
    setSelectedTab(item);
    setSelectedItemId(null); // Reset selected item when tab changes
    if (['inventory', 'add'].includes(item)) {
      setInventoryExpanded(true);
    } else {
      setInventoryExpanded(false);
    }
    if (['shipping', 'addShipping'].includes(item)) { 
      setShippingExpanded(true);
    } else {
      setShippingExpanded(false);
    }
    if (['receiving', 'addReceiving'].includes(item)) { 
      setReceivingExpanded(true);
    } else {
      setReceivingExpanded(false);
    }
    navigate(`/${item}?search=${searchQuery}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const params = new URLSearchParams(location.search);
    params.set('search', e.target.value);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleItemClick = (id, type) => {
    setSelectedItemId(id);
    navigate(`/item/${type}/${id}`);
  };

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Dashboard', link: '/dashboard' },
    ];

    switch (selectedTab) {
      case 'inventory':
        items.push({ label: 'Inventory', link: '/inventory' });
        break;
      case 'add':
        items.push({ label: 'Inventory', link: '/inventory' });
        items.push({ label: 'Add Item', link: '/add' });
        break;
      case 'shipping':
        items.push({ label: 'Shipping', link: '/shipping' });
        break;
      case 'addShipping':
        items.push({ label: 'Shipping', link: '/shipping' });
        items.push({ label: 'Add Shipping', link: '/addShipping' });
        break;
      case 'receiving':
        items.push({ label: 'Receiving', link: '/receiving' });
        break;
      case 'addReceiving':
        items.push({ label: 'Receiving', link: '/receiving' });
        items.push({ label: 'Add Receiving', link: '/addReceiving' });
        break;
      default:
        break;
    }

    if (selectedItemId) {
      items.push({ label: 'Item Details', link: `/item/${selectedTab}/${selectedItemId}` });
    }

    return items;
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <ActivityIcon className="h-6 w-6" />
              <span className="">WeBuyCisco</span>
            </Link>
            <div className="ml-auto h-8 w-10 flex items-center justify-center">
              <ModeToggle />
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/dashboard"
                onClick={() => handleSelection('dashboard')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  selectedTab === 'dashboard'
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to={`/inventory?search=${searchQuery}`}
                onClick={() => handleSelection('inventory')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  selectedTab === 'inventory'
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Package className="h-4 w-4" />
                Inventory
              </Link>
              {inventoryExpanded && (
                <div className="ml-6">
                  <Link
                    to={`/add?search=${searchQuery}`}
                    onClick={() => handleSelection('add')}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      selectedTab === 'add'
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    Add
                  </Link>
                </div>
              )}
              <Link
                to={`/shipping?search=${searchQuery}`}
                onClick={() => handleSelection('shipping')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  selectedTab === 'shipping'
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Package2 className="h-4 w-4" />
                Shipping
              </Link>
              {shippingExpanded && (
                <div className="ml-6">
                  <Link
                    to={`/addShipping?search=${searchQuery}`}
                    onClick={() => handleSelection('addShipping')}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      selectedTab === 'addShipping'
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    Add
                  </Link>
                </div>
              )}
              <Link
                to={`/receiving?search=${searchQuery}`}
                onClick={() => handleSelection('receiving')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  selectedTab === 'receiving'
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <PackageOpen className="h-4 w-4" />
                Receiving
              </Link>
              {receivingExpanded && (
                <div className="ml-6">
                  <Link
                    to={`/addReceiving?search=${searchQuery}`}
                    onClick={() => handleSelection('addReceiving')}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      selectedTab === 'addReceiving'
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    Add
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-4 text-lg font-medium">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                  <Package2 className="h-6 w-6" />
                  <span className="">WeBuyCisco</span>
                </Link>
                <hr className="my-2 border-t border-gray-200" />
                <Link
                  to="/dashboard"
                  onClick={() => handleSelection('dashboard')}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to={`/inventory?search=${searchQuery}`}
                  onClick={() => handleSelection('inventory')}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Inventory
                </Link>
                {inventoryExpanded && (
                  <div className="ml-6">
                    <Link
                      to={`/add?search=${searchQuery}`}
                      onClick={() => handleSelection('add')}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        selectedTab === 'add'
                          ? 'bg-muted text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      Add
                    </Link>
                  </div>
                )}
                <Link
                  to={`/shipping?search=${searchQuery}`}
                  onClick={() => handleSelection('shipping')}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
                >
                  <Package2 className="h-5 w-5" />
                  Shipping
                </Link>
                {shippingExpanded && (
                  <div className="ml-6">
                    <Link
                      to={`/addShipping?search=${searchQuery}`}
                      onClick={() => handleSelection('addShipping')}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        selectedTab === 'addShipping'
                          ? 'bg-muted text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      Add
                    </Link>
                  </div>
                )}
                <Link
                  to={`/receiving?search=${searchQuery}`}
                  onClick={() => handleSelection('receiving')}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <PackageOpen className="h-5 w-5" />
                  Receiving
                </Link>
                {receivingExpanded && (
                  <div className="ml-6">
                    <Link
                      to={`/addReceiving?search=${searchQuery}`}
                      onClick={() => handleSelection('addReceiving')}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        selectedTab === 'addReceiving'
                          ? 'bg-muted text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      Add
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Breadcrumbs items={getBreadcrumbItems()} />
          <Outlet context={{ searchQuery, handleItemClick }} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
