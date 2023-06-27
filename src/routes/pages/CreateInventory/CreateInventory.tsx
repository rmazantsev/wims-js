import {useContext, useEffect, useState, FC} from "react";
import {JwtContext} from "../../Root";
import {IWarehouse} from "../../../domain/IWarehouse";
import {Table, Title, TextInput, Button, Box, Select, Flex} from '@mantine/core';
import './index.scss';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {IStore} from "../../../domain/IStore";
import {useForm} from '@mantine/form';
import {StoreService} from "../../../services/StoreService";
import {ItemService} from "../../../services/ItemService";
import {IItem} from "../../../domain/IItem";
import {IUnit} from "../../../domain/IUnit";
import {ICategory} from "../../../domain/ICategory";
import {IItemComponent} from "../../../domain/IItemComponent";
import {CategoryService} from "../../../services/CategoryService";
import {notifications} from "@mantine/notifications";
import {AxiosError} from "axios";
import {WarehouseService} from "../../../services/WarehouseService";
import {IStorageInventory} from "../../../domain/IStorageInventory";
import {WarehouseInventoryService} from "../../../services/WarehouseInventoryService";
import {StoreInventoryService} from "../../../services/StoreInventoryService";

interface props {
    storageType: string
};

interface itemFormProps {
    name: string,
    description?: string,
    itemComponents?: IItemComponent[] | [],
    unit?: IUnit,
    category?: ICategory,
}

const CreateInventory: FC<props> = ({storageType}) => {
    const {id} = useParams();

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const [storageData, setStorageData] = useState<IWarehouse[] | IStore[] | null>(null);
    const [itemsData, setItemsData] = useState<IItem[] | null>(null);
    const [inventoryData, setInventoryData] = useState<IStorageInventory | null>(null);

    const [currentStorage, setCurrentStorage] = useState<string | null | undefined>(undefined);
    const [currentItem, setItem] = useState<string | undefined | null>(undefined);
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const itemService = new ItemService(setJwtResponse!);
    const categoryService = new CategoryService(setJwtResponse!);
    const warehouseInventoryService = new WarehouseInventoryService(setJwtResponse!);
    const storeInventoryService = new StoreInventoryService(setJwtResponse!);
    const navigate = useNavigate();
    const warehouseService = new WarehouseService(setJwtResponse!);
    const storeService = new StoreService(setJwtResponse!);

    useEffect(() => {
        if (jwtResponse) {
            if (storageType === 'warehouses') {
                warehouseService.getAll(jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            setStorageData(response);
                        } else {
                            // redirect to login because of refresh request error
                            setStorageData([]);
                        }
                    }
                );
            }
            if (storageType === 'stores') {
                storeService.getAll(jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            setStorageData(response);
                        } else {
                            // redirect to login because of refresh request error
                            setStorageData([]);
                        }
                    }
                );
            }
            itemService.getAll(jwtResponse).then(
                response => {
                    console.log(response);
                    if (response) {
                        setItemsData(response);
                    } else {
                        // redirect to login because of refresh request error
                        setItemsData(null);
                    }
                }
            );
        }
    }, []);

    useEffect(() => {
        if (!id) return;
        if (id && !!storageData?.length && jwtResponse) {
            if (storageType !== 'stores') {
                warehouseInventoryService.getEntity(id, jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            setInventoryData(response);
                            form.setValues(response);
                            setCurrentStorage(response.warehouseId)
                            setItem(response.item?.id);
                        } else {
                            // redirect to login because of refresh request error
                            setInventoryData(null);
                        }
                    }
                );
            }
            if (storageType === 'stores') {
                storeInventoryService.getEntity(id, jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            setInventoryData(response);
                            form.setValues(response);
                            setCurrentStorage(response.storeId)
                            setItem(response.item?.id);
                        } else {
                            // redirect to login because of refresh request error
                            setInventoryData(null);
                        }
                    }
                );
            }
        }
    }, [id, storageData]);

    const form = useForm<IStorageInventory | null>({
        initialValues: {
            quantity: 0,
            locationId: undefined,
            location: undefined,
        },
    });

    const onSubmit = async (values: IStorageInventory | null) => {
        if (!values) {
            setValidationErrors(["Bad input values"]);
            return;
        };

        if (values.quantity == 0 || currentItem == null || currentStorage == null) {
            setValidationErrors(["Bad input values"]);
            return;
        }
        values.itemId = currentItem;
        if (storageType !== 'stores') {
            values.warehouseId = currentStorage;
        }
        if (storageType === 'stores') {
            values.storeId = currentStorage;
        }
        values.item = undefined;
        values.warehouse = undefined;
        values.store = undefined;
        // remove errors
        setValidationErrors([]);
        if (!id) {
            if (storageType !== 'stores') {
                //@ts-ignore
                var entity = await warehouseInventoryService.createEntity(values, jwtResponse!);
                if (!entity?.id) {
                    setValidationErrors(['Bad request']);
                    return;
                } else {
                    navigate('/warehousesinventory');
                }
            }
            if (storageType === 'stores') {
                //@ts-ignore
                var entity = await storeInventoryService.createEntity(values, jwtResponse!);
                if (!entity?.id) {
                    setValidationErrors(['Bad request']);
                    return;
                } else {
                    navigate('/storesinventory');
                }
            }
        } else {
            if (storageType !== 'stores') {
                //@ts-ignore
                var result = await warehouseInventoryService.updateEntity(values, jwtResponse!);
                if (!result) {
                    setValidationErrors(['Bad request']);
                    return;
                } else {
                    navigate('/warehousesinventory');
                }
            }
            if (storageType === 'stores') {
                //@ts-ignore
                var result = await storeInventoryService.updateEntity(values, jwtResponse!);
                if (!result) {
                    setValidationErrors(['Bad request']);
                    return;
                } else {
                    navigate('/storesinventory');
                }
            }
        }
    }

    return (
        <>
            <div style={{display: 'flex'}}>
                <Title mx="10%" pt="10px" order={2} style={{marginTop: '25px'}}>
                    {!!inventoryData?.id ? ' Edit' : 'Create new'} inventory
                </Title>
            </div>
            <div style={{display: "flex", alignItems: 'flex-start'}}>
                <Box maw={400} mx="10%" my='30px' style={{flexGrow: 1}}>

                    <form
                        onSubmit={form.onSubmit((values) => onSubmit(values))}
                    >
                        <ul style={{'display': validationErrors.length == 0 ? 'none' : ''}}>
                            <li style={{color: 'red'}}>{validationErrors.length > 0 ? validationErrors[0] : ''}</li>
                        </ul>
                        <Select
                            mt='15px'
                            label={`${storageType !== 'stores' ? "Warehouse" : "Store"}`}
                            value={currentStorage}
                            onChange={value => setCurrentStorage(value)}
                            //@ts-ignore
                            data={storageData?.map(item => ({label: item.name, value: item?.id})) ?? []}
                            searchable
                        />
                        <Select
                            searchable
                            mt='15px'
                            label="Item"
                            value={currentItem}
                            onChange={value => setItem(value)}
                            //@ts-ignore
                            data={itemsData?.map(item => ({label: item.name, value: item?.id})) ?? []} />
                        <div style={{display: 'flex'}}>
                            <TextInput
                                w={'100%'}
                                label="Quantity"
                                placeholder="Quantity"
                                mt="md"
                                {...form.getInputProps('quantity')}
                                type="number"
                            />
                            <Select w={200}
                                ml={'sm'}
                                mt='md'
                                label="Unit"
                                placeholder={`${itemsData?.find(i => i.id === currentItem)?.unit?.name ? `${itemsData?.find(i => i.id === currentItem)?.unit?.name} (${itemsData?.find(i => i.id === currentItem)?.unit?.description})` : ''}`}
                                disabled
                                //@ts-ignore
                                data={[]}
                            />
                        </div>
                        <Button mt='20%' type="submit">
                            {!!inventoryData?.id ? 'Edit' : 'Create'} inventory
                        </Button>
                    </form>
                </Box>
            </div>
        </>
    );
}

export default CreateInventory;