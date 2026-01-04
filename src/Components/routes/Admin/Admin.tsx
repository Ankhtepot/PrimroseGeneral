import { useState } from 'react';
import styles from './Admin.module.scss';
import DatabaseTab from "../../Common/DatabaseTab/DatabaseTab.tsx";

interface UserData {
    id: number;
    name: string;
    role: string;
    status: string;
}

function Admin() {
    const [data, setData] = useState<UserData[]>([
        { id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', role: 'User', status: 'Inactive' },
        { id: 3, name: 'Bob Johnson', role: 'Editor', status: 'Active' },
    ]);

    const handleUpdate = (index: number, updatedItem: UserData) => {
        const newData = [...data];
        newData[index] = updatedItem;
        setData(newData);
    };

    const handleDelete = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
    };

    const handleCreate = (newItem: UserData) => {
        setData([...data, { ...newItem, id: data.length + 1 }]);
    };

    return (
        <div className={styles.container}>
            <h1>Administration</h1>
            <p>Welcome to the administration panel.</p>
            
            <div className={styles.tableSection}>
                <h2>User Management</h2>
                <DatabaseTab<UserData> 
                    data={data}
                    editable={true}
                    deletable={true}
                    creatable={true}
                    excludeFields={['id']}
                    readOnlyFields={['status']}
                    maxHeight="400px"
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                />
            </div>
        </div>
    );
}

export default Admin;