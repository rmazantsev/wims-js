import {useContext, useEffect, useState, FC} from "react";
import {JwtContext} from "../../Root";
import {Table, Title, Button, rem} from '@mantine/core';
import './index.scss';
import {useNavigate} from "react-router-dom";
import {notifications} from '@mantine/notifications';
import classnames from 'classnames';
import {InventoryTransactionService} from "../../../services/InventoryTransactionService";
import {IInventoryTransaction} from "../../../domain/IInventoryTransaction";

interface props {
    // storageType: string
};

const TransactionsEnum = {
    A: 'Addition',
    W: 'Withdrawing',
    M: 'Movement',
}

const TransactionHistory: FC<props> = () => {
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const inventoryTransactionService = new InventoryTransactionService(setJwtResponse!);
    const navigate = useNavigate();

    const [data, setData] = useState<IInventoryTransaction[]>([]);

    console.log("setData:", setData)


    useEffect(() => {
        if (jwtResponse) {
            inventoryTransactionService.getAll(jwtResponse).then(
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
            const res = await inventoryTransactionService.deleteEntity(id, jwtResponse!)
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

    const getColor = (type: string): string => {
        switch (type) {
            case 'A':
                return 'green'
            case 'W':
               return  'red'
            case 'M':
              return  ''
        }
        return '';
    }

    const getSign = (type: string): string => {
        switch (type) {
            case 'A':
                return '+'
            case 'W':
               return  '-'
            case 'M':
              return  ''
        }
        return '';
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
                        order={2}
                        style={{marginTop: '25px', marginLeft: '15px'}}
                    >Transactions
                    </Title>
                </div>
            </div>
            <Table verticalSpacing="sm" highlightOnHover={false} style={{marginTop: '50px'}}>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Action</th>
                        <th>Storage</th>
                        <th>Date</th>
                        <th>User</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((transaction) => (
                        <tr
                            key={transaction.id}
                            className="table-row2"
                        >
                            <td>{transaction?.item?.name}</td>
                            <td style={{color: `${getColor(transaction.transactionType)}`, fontWeight: '600'}}>{getSign(transaction.transactionType)} {transaction?.quantity}</td>
                            <td>{transaction.item?.unit?.name} ({transaction.item?.unit?.description})</td>
                            <td>{TransactionsEnum[transaction.transactionType as keyof typeof TransactionsEnum]}</td>
                            <td>{!!transaction.warehouse?.name ? transaction.warehouse?.name : transaction.store?.name}</td>
                            <td>{new Date(transaction.timeStamp).toLocaleString()}</td>
                            <td>{transaction.appUser?.firstName} {transaction.appUser?.lastName}</td>
                            <td style={{textAlign: "end"}}>
                                <Button
                                    styles={(theme) => ({
                                        root: {
                                            '&:not([data-disabled])': theme.fn.hover({
                                                backgroundColor: theme.fn.darken('#e7f5ff', 0.05),
                                            }),
                                        },
                                    })}
                                    onClick={(e) => {e.stopPropagation(); deleteEntity(transaction.id)}}
                                    style={{marginLeft: '8px'}} variant="subtle">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default TransactionHistory;