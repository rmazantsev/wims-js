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
import {ItemService} from "../../../services/ItemService";
import {IItem} from "../../../domain/IItem";

interface props {
    // storageType: string
};

const Items: FC<props> = () => {
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const itemService = new ItemService(setJwtResponse!);
    const navigate = useNavigate();

    const [data, setData] = useState<IItem[]>([]);

    console.log("setData:", setData)


    useEffect(() => {
        if (jwtResponse) {
            itemService.getAll(jwtResponse).then(
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
    }, []);

    async function deleteEntity(id: string | undefined) {
        if (!id) return;
        try {
            const res = await itemService.deleteEntity(id, jwtResponse!)
            if (res === true) {
                setData(prev => [...prev.filter(w => w.id !== id)]);
            }
            // @ts-ignore
            if (res?.response?.status === 400) {
                notifications.show({
                    title: 'Error',
                    // @ts-ignore
                    message: `${res?.response?.data}`,
                    color: 'red',
                    autoClose: 3000,
                })
            }
            // @ts-ignore
            if (res?.response?.status === 500) {
                notifications.show({
                    title: 'Error',
                    // @ts-ignore
                    message: `Has components or used as component itself`,
                    color: 'red',
                    autoClose: 3000,
                })
            }
        } catch (error) {
            console.log('error: ', (error as Error).message);
            return undefined;
        }
    }

    const handleEdit = (id: string | undefined) => {
        if (!id) return;
        navigate(`/items/${id}`);
    }

    return (
        <>
            <div style={{
                display: "flex", justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
                <div style={{display: "flex"}}>
                    <Title
                        className={classnames('not-header-item', {
                        })}
                        order={3}
                        style={{marginTop: '25px', marginLeft: '15px'}}
                    >Items
                    </Title>
                </div>
                <Button size="xs" onClick={() => navigate('/createitem')}>Create new item</Button>
            </div>
            <Table verticalSpacing="sm" highlightOnHover={true} style={{marginTop: '50px'}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Category</th>
                        <th>Desription</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className="table-row"
                            onClick={()=>handleEdit(item.id)}
                        >
                            <td>{item?.name}</td>
                            <td>{item.unit?.name} ({item.unit?.description})</td>
                            <td>{item.category?.name}</td>
                            <td>{item.description}</td>
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
                                    onClick={(e) => {e.stopPropagation(); handleEdit(item.id)}}
                                >Edit</Button>
                                <Button
                                    styles={(theme) => ({
                                        root: {
                                            '&:not([data-disabled])': theme.fn.hover({
                                                backgroundColor: theme.fn.darken('#e7f5ff', 0.05),
                                            }),
                                        },
                                    })}
                                    onClick={(e) => {e.stopPropagation(); deleteEntity(item.id)}}
                                    style={{marginLeft: '8px'}} variant="subtle">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default Items;