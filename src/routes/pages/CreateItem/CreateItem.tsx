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
import {UnitService} from "../../../services/UnitService";
import ComponentItem from "./ComponentItem/ComponentItem";
import {ItemComponentService} from "../../../services/ItemComponentService";
import {notifications} from "@mantine/notifications";
import {AxiosError} from "axios";

interface props {
    // storageType: string
};

interface itemFormProps {
    name: string,
    description?: string,
    itemComponents?: IItemComponent[] | [],
    unit?: IUnit,
    category?: ICategory,
}

const CreateItem: FC<props> = () => {
    const {state} = useLocation();
    const {id} = useParams();

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const [data, setData] = useState<IItem | null>(null);

    const [unitData, setUnitData] = useState<IUnit[] | undefined>(undefined);
    const [categoryData, setCategoryData] = useState<ICategory[] | undefined>(undefined);
    const [currentCategory, setCategory] = useState<string | undefined | null>(undefined);
    const [currentUnit, setUnit] = useState<string | undefined | null>(undefined);
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const itemService = new ItemService(setJwtResponse!);
    const categoryService = new CategoryService(setJwtResponse!);
    const unitService = new UnitService(setJwtResponse!);
    const itemComponentService = new ItemComponentService(setJwtResponse!);
    const navigate = useNavigate();

    useEffect(() => {
        categoryService.getAll(jwtResponse!).then(
            response => {
                console.log(response);
                if (response) {
                    setCategoryData(response);
                    if (!id) {
                        setCategory(response[0]?.id);
                    }
                } else {
                    // redirect to login because of refresh request error
                    setCategoryData([]);
                }
            }
        );
        unitService.getAll(jwtResponse!).then(
            response => {
                console.log(response);
                if (response) {
                    setUnitData(response);
                    if (!id) {
                        setUnit(response[0]?.id);
                    }
                } else {
                    // redirect to login because of refresh request error
                    setUnitData([]);
                }
            }
        );
    }, [])

    useEffect(() => {
        if (!id) return;
        if (jwtResponse) {
            itemService.getEntity(id, jwtResponse).then(
                response => {
                    console.log(response);
                    if (response) {
                        form.setValues(response);
                        setData(response);
                        setCategory(response.category?.id);
                        setUnit(response.unit?.id);
                    } else {
                        // redirect to login because of refresh request error
                        setData(null);
                    }
                }
            );
        }
    }, [id, state]);

    const form = useForm<itemFormProps | null>({
        initialValues: {
            name: '',
            description: '',
            itemComponents: [],
            unit: undefined,
            category: undefined,
        },
    });

    const onSubmit = async (values: itemFormProps | null) => {
        if (!values) {
            setValidationErrors(["Bad input values"]);
            return;
        };

        if (values.name.length < 3) {
            setValidationErrors(["Bad input values"]);
            return;
        }
        // values.category = categoryData?.find(c => c.id == currentCategory)
        // values.unit = unitData?.find(c => c.id == currentUnit)
        //@ts-ignore
        values.unitId = currentUnit;
        //@ts-ignore
        values.categoryId = currentCategory;
        values.itemComponents = [];
        values.unit = undefined;
        values.category = undefined;
        console.log("onSubmit  values:", values)
        // remove errors
        setValidationErrors([]);
        if (!id) {
            //@ts-ignore
            var entity = await itemService.createEntity(values, jwtResponse!);
            if (!entity?.id) {
                setValidationErrors(['Bad request']);
                return;
            } else {
                navigate('/items');
            }
        } else {
            //@ts-ignore
            var result = await itemService.updateEntity(values, jwtResponse!);
            if (!result) {
                setValidationErrors(['Bad request']);
                return;
            } else {
                navigate('/items');
            }
        }
    }

    const deleteEntity = async (componentId: string | undefined) => {
        if (!componentId) return;
        try {
            const res = await itemComponentService.deleteEntity(componentId, jwtResponse!);
            if (res) {
                navigate(`/items/${id}`, {state: Math.random()});
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
        } catch (e) {
            notifications.show({
                title: 'Request error',
                message: (e as AxiosError).message,
                color: 'red',
            })
        }
    }

    return (
        <>
            <div style={{display: 'flex'}}>
                <Title mx="10%" pt="10px" order={2} style={{marginTop: '25px'}}>
                    {data?.id ? ' Edit' : 'Create new'} item

                </Title>
                <Title ml="23%" pt="30px" order={4} style={{marginTop: '25px'}}>
                    Item components
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
                        <TextInput
                            label="Name"
                            placeholder="Name"
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Description"
                            placeholder="Description"
                            mt="md"
                            {...form.getInputProps('description')}
                        />
                        <Select
                            searchable
                            mt='15px'
                            label="Unit"
                            value={currentUnit}
                            onChange={value => setUnit(value)}
                            //@ts-ignore
                            data={unitData?.map(item => ({label: item.name, value: item?.id})) ?? []} />
                        <Select
                            searchable
                            mt='15px'
                            label="Category"
                            value={currentCategory}
                            onChange={value => setCategory(value)}
                            //@ts-ignore
                            data={categoryData?.map(item => ({label: item.name, value: item?.id})) ?? []} />
                        <ComponentItem currentItemId={id} />
                        <Button mt='20%' type="submit">
                            {data?.id ? 'Edit' : 'Create'} item
                        </Button>
                    </form>
                </Box>
                {data && (
                    <Table verticalSpacing="sm" highlightOnHover={false} style={{marginTop: '50px'}} maw={600}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Unit</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.itemComponents?.map((component) => (
                                <tr
                                    key={component.id}
                                    className="table-row"
                                >
                                    <td>{component.componentItem?.name}</td>
                                    <td>{component.componentQuantity}</td>
                                    <td>{component?.componentItem?.unit?.name}</td>
                                    <td style={{textAlign: "end"}}>
                                        <Button
                                            styles={(theme) => ({
                                                root: {
                                                    '&:not([data-disabled])': theme.fn.hover({
                                                        backgroundColor: theme.fn.darken('#e7f5ff', 0.05),
                                                    }),
                                                },
                                            })}
                                            onClick={(e) => {e.stopPropagation(); deleteEntity(component.id)}}
                                            style={{marginLeft: '8px'}} variant="subtle">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </>
    );
}

export default CreateItem;