import {useContext, useEffect, useState, FC} from "react";
import {JwtContext} from "../../Root";
import {WarehouseService} from "../../../services/WarehouseService";
import {IWarehouse, } from "../../../domain/IWarehouse";
import {Table, Title, Button, rem} from '@mantine/core';
import './index.scss';
import {useNavigate} from "react-router-dom";
import {notifications} from '@mantine/notifications';
import {WarehouseInventoryService} from "../../../services/WarehouseInventoryService";
import {StoreInventoryService} from "../../../services/StoreInventoryService";
import {IStorageInventory} from "../../../domain/IStorageInventory";
import classnames from 'classnames';

export interface WarehouseInventoriesProps {
    storageType: string
    storageName?: string
};

const WarehouseInventories: FC<WarehouseInventoriesProps> = ({storageType, storageName}) => {
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const warehouseInventoryService = new WarehouseInventoryService(setJwtResponse!);
    const storeInventoryService = new StoreInventoryService(setJwtResponse!);
    const navigate = useNavigate();

    const [data, setData] = useState<IStorageInventory[] | []>([]);

    useEffect(() => {
        if (jwtResponse) {
            if (storageType === 'warehouses') {
                warehouseInventoryService.getAll(jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            setData(response);
                        } else {
                            // redirect to login because of refresh request error
                            setData([]);
                        }
                    }
                );
            }
            if (storageType === 'stores') {
                storeInventoryService.getAll(jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            setData(response);
                        } else {
                            // redirect to login because of refresh request error
                            setData([]);
                        }
                    }
                );
            }
        }
    }, []);

    async function deleteEntity(id: string | undefined) {
        if (!id) return;
        if (storageType === 'warehouses') {
            try {
                const res = await warehouseInventoryService.deleteEntity(id, jwtResponse!)
                if (res === true) {
                    setData(prev => [...prev.filter(w => w.id !== id)]);
                }
                // @ts-ignore
                if (res?.response?.status === 400) {
                    notifications.show({
                        title: 'Error',
                        color: 'red',
                        // @ts-ignore
                        message: `${res?.response?.data}`,
                        autoClose: 3000,
                    })
                }
            } catch (error) {
                console.log('error: ', (error as Error).message);
                return undefined;
            }
        }
        if (storageType === 'stores') {
            try {
                const res = await storeInventoryService.deleteEntity(id, jwtResponse!)
                if (res === true) {
                    setData(prev => [...prev.filter(w => w.id !== id)]);
                }
                // @ts-ignore
                if (res?.response?.status === 400) {
                    notifications.show({
                        title: 'Error',
                        // @ts-ignore
                        message: `${res?.response?.data}`,
                        autoClose: 3000,
                        color: 'red',
                    })
                }
            } catch (error) {
                console.log('error: ', (error as Error).message);
                return undefined;
            }
        }
    }

    const handleEdit = (id: string | undefined) => {
        if (!id) return;
        if (storageType !== 'stores') {
            navigate(`/warehouseinventory/${id}`);
        }
        if (storageType === 'stores') {
            navigate(`/storeinventory/${id}`);
        }
    }

    const handleNavigate = (inventoryId: string | undefined) => {
        if (!inventoryId) return;
        (storageType !== 'stores') ?
            navigate(`/warehouseinventory/${inventoryId}`) :
            navigate(`/storeinventory/${inventoryId}`)
    }

    return (
        <>
            <div style={{
                display: "flex", justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
                <div style={{display: "flex", borderBottom: "2px solid #d3d3d3"}}>
                    <Title
                        className={classnames('header-item', {

                        })}
                        order={3}
                        style={{marginTop: '25px', borderBottom: `${storageType !== 'stores' ? '2px solid blue' : ''}`}}
                        onClick={() => navigate(`/warehousesinventory`)}
                    >
                        Warehouses inventory
                    </Title>
                    <Title
                        className={classnames('header-item', {
                        })}
                        order={3}
                        style={{marginTop: '25px', marginLeft: '15px', borderBottom: `${storageType === 'stores' ? '2px solid blue' : ''}`}}

                        onClick={() => navigate(`/storesinventory`)}
                    >
                        Stores inventory
                    </Title>
                </div>
                <Button size="xs" onClick={() => navigate(`${storageType !== 'stores' ? '/createwarehouseinventory' : '/createstoreinventory'}`)}>Create new inventory</Button>
            </div>
            <Table verticalSpacing="sm" highlightOnHover={true} style={{marginTop: '50px'}}>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Amount</th>
                        <th>Unit</th>
                        <th>{storageType !== 'stores' ? 'Warehouse' : 'Store'} name</th>
                        <th>Last updated</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((inventory) => (
                        <tr
                            key={inventory.id}
                            className="table-row"
                            onClick={() => handleNavigate(inventory?.id)}
                        >
                            <td>{inventory.item?.name}</td>
                            <td>{inventory.quantity}</td>
                            <td>{inventory.item?.unit?.name} ({inventory.item?.unit?.description})</td>
                            <td>{storageType !== 'stores' ? inventory.warehouse?.name : inventory.store?.name}</td>
                            <td>{new Date(inventory.lastUpdated!).toLocaleString()}</td>
                            <td style={{textAlign: "end"}}>
                                <Button
                                    styles={(theme) => ({
                                        root: {
                                            '&:not([data-disabled])': theme.fn.hover({
                                                backgroundColor: theme.fn.darken('#e7f5ff', 0.05),
                                            }),
                                        },
                                    })}
                                    style={{width: '78px'}} variant="subtle"
                                    onClick={(e) => {e.stopPropagation(); handleEdit(inventory?.id)}}
                                >Edit</Button>
                                <Button
                                    styles={(theme) => ({
                                        root: {
                                            '&:not([data-disabled])': theme.fn.hover({
                                                backgroundColor: theme.fn.darken('#e7f5ff', 0.05),
                                            }),
                                        },
                                    })}
                                    onClick={(e) => {e.stopPropagation(); deleteEntity(inventory.id)}}
                                    style={{marginLeft: '8px'}} variant="subtle">Delete</Button>
                            </td>
                        </tr>
                    )
                    )}
                </tbody>
            </Table>
        </>
    );
}

export default WarehouseInventories;