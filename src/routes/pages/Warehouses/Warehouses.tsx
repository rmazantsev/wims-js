import {useContext, useEffect, useState, FC} from "react";
import {JwtContext} from "../../Root";
import {WarehouseService} from "../../../services/WarehouseService";
import {IWarehouse, } from "../../../domain/IWarehouse";
import {Table, Title, Button, rem} from '@mantine/core';
import './index.scss';
import {useNavigate} from "react-router-dom";
import {notifications} from '@mantine/notifications';
import classnames from 'classnames';
import {IStore} from "../../../domain/IStore";
import {StoreService} from "../../../services/StoreService";

interface props {
    storageType: string
};

const Warehouses: FC<props> = ({storageType}) => {
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const warehouseService = new WarehouseService(setJwtResponse!);
    const storeService = new StoreService(setJwtResponse!);
    const navigate = useNavigate();

    const [data, setData] = useState<IWarehouse[] | IStore[]>([]);

    useEffect(() => {
        if (jwtResponse) {
            if (storageType === 'warehouses') {
                warehouseService.getAll(jwtResponse).then(
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
                storeService.getAll(jwtResponse).then(
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

        console.log("deleteEntity  id:", id)

        if (!id) return;
        if (storageType === 'warehouses') {
            try {
                const res = await warehouseService.deleteEntity(id, jwtResponse!)
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
                const res = await storeService.deleteEntity(id, jwtResponse!)
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
        console.log("handleEdit  storageType:", storageType)
        if (!id) return;
        if (storageType !== 'stores') {
            navigate(`/warehouses/${id}`);
        }
        if (storageType === 'stores') {
            navigate(`/stores/${id}`);
        }
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
                        onClick={() => navigate(`/warehouses`)}
                    >
                        Warehouses
                    </Title>
                    <Title
                        className={classnames('header-item', {
                        })}
                        order={3}
                        style={{marginTop: '25px', marginLeft: '15px', borderBottom: `${storageType === 'stores' ? '2px solid blue' : ''}`}}

                        onClick={() => navigate(`/stores`)}
                    >Stores
                    </Title>
                </div>
                <Button size="xs" onClick={() => navigate(`${storageType !== 'stores' ? '/createwarehouse' : '/createstore'}`)}>Create {storageType !== 'stores' ? 'warehouse' : 'store'}</Button>
            </div>
            <Table verticalSpacing="sm" highlightOnHover={false} style={{marginTop: '50px'}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((warehouse) => (
                        <tr
                            key={warehouse.id}
                            className="table-row2"
                            // onClick={() => navigate(`/warehousesinventory/${warehouse.id}`)}
                        >
                            <td>{warehouse.name}</td>
                            <td>{warehouse.address}

                            </td>
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
                                    onClick={(e) => {e.stopPropagation(); handleEdit(warehouse?.id)}}
                                >Edit</Button>
                                <Button
                                    styles={(theme) => ({
                                        root: {
                                            '&:not([data-disabled])': theme.fn.hover({
                                                backgroundColor: theme.fn.darken('#e7f5ff', 0.05),
                                            }),
                                        },
                                    })}
                                    onClick={(e) => {e.stopPropagation(); deleteEntity(warehouse.id)}}
                                    style={{marginLeft: '8px'}} variant="subtle">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default Warehouses;