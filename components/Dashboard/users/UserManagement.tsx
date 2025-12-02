'use client';

import React, { useEffect, useState } from 'react';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  toggleUserSuspension,
  updateUserProfile,
  getApplications,
  deleteApplication,
} from '@/lib/database';
import { ContributorApplication } from '@/types/application';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import PageTitle from '@/components/PageTitle/PageTitle';
import { withAuth } from '@/hoc/withAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserProfile } from '@/types/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [applications, setApplications] = useState<ContributorApplication[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Create User State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<
    'admin' | 'contributor' | 'user'
  >('user');
  const [isCreating, setIsCreating] = useState(false);

  // Edit Name State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [usersData, applicationsData] = await Promise.all([
      getUsers(),
      getApplications(),
    ]);
    setUsers(usersData);
    setApplications(applicationsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async () => {
    setIsCreating(true);
    try {
      // Use a secondary app to create user without logging out the admin
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const secondaryAppName = 'secondaryApp';
      let secondaryApp;

      // Check if app already exists to avoid duplicate initialization error
      if (getApps().some((app) => app.name === secondaryAppName)) {
        secondaryApp = getApp(secondaryAppName);
      } else {
        secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      }

      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newUserEmail,
        newUserPassword,
      );
      const user = userCredential.user;

      // Create profile in database
      await updateUserProfile(user.uid, {
        uid: user.uid,
        email: user.email ?? undefined,
        displayName: newUserName,
        role: newUserRole,
        suspended: false,
        photoURL: '',
      });

      // Cleanup
      await signOut(secondaryAuth);
      // We don't delete the app immediately to avoid issues if we reuse it quickly,
      // but strictly speaking we should manage lifecycle. For now, keeping it is fine or deleting it.
      // await deleteApp(secondaryApp);

      toast({ description: 'User created successfully' });
      setIsCreateDialogOpen(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
      setNewUserRole('user');

      // Check if there was a pending application for this email and delete it
      const application = applications.find(
        (app) => app.email === newUserEmail,
      );
      if (application) {
        await deleteApplication(application.id);
      }

      fetchData();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        description: `Failed to create user: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditName = async () => {
    if (!editingUser) return;
    try {
      await updateUserProfile(editingUser.uid, { displayName: editName });
      toast({ description: 'User name updated successfully' });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      toast({
        description: 'Failed to update user name',
        variant: 'destructive',
      });
    }
  };

  const handleApproveApplication = (app: ContributorApplication) => {
    setNewUserName(app.name);
    setNewUserEmail(app.email);
    setNewUserRole('contributor');
    setNewUserPassword(''); // Admin needs to set a temporary password
    setIsCreateDialogOpen(true);
    // We will delete the application after successful user creation
  };

  const handleDeclineApplication = async (id: string) => {
    try {
      await deleteApplication(id);
      toast({ description: 'Application declined and removed' });
      fetchData();
    } catch (error) {
      toast({
        description: 'Failed to decline application',
        variant: 'destructive',
      });
    }
  };

  const handleRoleChange = async (
    uid: string,
    newRole: 'admin' | 'contributor' | 'user',
  ) => {
    try {
      await updateUserRole(uid, newRole);
      toast({ description: 'User role updated successfully' });
      fetchData();
    } catch (error) {
      toast({
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleSuspend = async (uid: string, currentStatus: boolean) => {
    try {
      await toggleUserSuspension(uid, !currentStatus);
      toast({
        description: `User ${!currentStatus ? 'suspended' : 'unsuspended'} successfully`,
      });
      fetchData();
    } catch (error) {
      toast({
        description: 'Failed to update suspension status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (uid: string) => {
    try {
      await deleteUser(uid);
      toast({ description: 'User deleted successfully' });
      fetchData();
    } catch (error) {
      toast({ description: 'Failed to delete user', variant: 'destructive' });
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className='min-h-screen md:max-w-6xl mx-auto px-0 md:px-8 my-12 md:my-16'>
      <PageTitle
        icon={<UserCog />}
        title='User Management'
        description='Manage users and their roles'
      />

      <div className='flex justify-end'>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='role'>Role</Label>
                <Select
                  value={newUserRole}
                  onValueChange={(val: any) => setNewUserRole(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='admin'>Administrator</SelectItem>
                    <SelectItem value='contributor'>Contributor</SelectItem>
                    <SelectItem value='user'>User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Name</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='edit-name'>Name</Label>
              <Input
                id='edit-name'
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue='users' className='w-full mt-6'>
        <TabsList>
          <TabsTrigger value='users'>Users</TabsTrigger>
          <TabsTrigger value='applications'>
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='users'>
          <div className='overflow-x-auto shadow-lg'>
            <Table className='w-full border border-black'>
              <TableHeader>
                <TableRow className='bg-gray-50 border border-black'>
                  <TableHead className='font-bold bg-black text-white text-lg py-2'>
                    Name
                  </TableHead>
                  <TableHead className='font-bold bg-black text-white text-lg py-2'>
                    Email
                  </TableHead>
                  <TableHead className='font-bold bg-black text-white text-lg py-2'>
                    Role
                  </TableHead>
                  <TableHead className='font-bold bg-black text-white text-lg py-2'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.uid}
                    className='hover:bg-gray-50 transition-colors border border-black'
                  >
                    <TableCell className='text-black py-1.5'>
                      <div className='flex items-center gap-2'>
                        {user.displayName || 'N/A'}
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-6 w-6 p-0'
                          onClick={() => {
                            setEditingUser(user);
                            setEditName(user.displayName || '');
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <UserCog className='h-3 w-3' />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className='text-black py-1.5'>
                      {user.email}
                    </TableCell>
                    <TableCell className='text-black py-1.5'>
                      <Select
                        value={user.role}
                        onValueChange={(
                          value: 'admin' | 'contributor' | 'user',
                        ) => handleRoleChange(user.uid, value)}
                      >
                        <SelectTrigger className='w-[130px]'>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='admin'>Administrator</SelectItem>
                          <SelectItem value='contributor'>
                            Contributor
                          </SelectItem>
                          <SelectItem value='user'>User</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className='py-1.5 flex gap-2'>
                      <Button
                        variant={user.suspended ? 'default' : 'outline'}
                        size='sm'
                        onClick={() =>
                          handleSuspend(user.uid, user.suspended || false)
                        }
                        className={
                          user.suspended
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : ''
                        }
                      >
                        {user.suspended ? 'Unsuspend' : 'Suspend'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='destructive' size='sm'>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.email}? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.uid)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value='applications'>
          <div className='grid gap-4'>
            {applications.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                No pending applications
              </div>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <CardTitle>{app.name}</CardTitle>
                    <CardDescription>
                      {app.email} • Applied on{' '}
                      {new Date(app.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div>
                        <h4 className='font-semibold mb-2'>Cover Letter:</h4>
                        <p className='text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md'>
                          {app.coverLetter}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <Button onClick={() => handleApproveApplication(app)}>
                          Approve & Create User
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant='destructive'>Decline</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Decline Application
                              </AlertDialogTitle>
                              <DialogDescription>
                                Are you sure you want to decline this
                                application from {app.name}? This will remove
                                the application.
                              </DialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeclineApplication(app.id)}
                              >
                                Decline
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default withAuth(UserManagement, ['admin']);
