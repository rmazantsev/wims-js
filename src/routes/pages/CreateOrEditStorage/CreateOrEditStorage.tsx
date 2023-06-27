import {useContext, useEffect, useState, FC} from "react";
import {JwtContext} from "../../Root";
import {WarehouseService} from "../../../services/WarehouseService";
import {IWarehouse} from "../../../domain/IWarehouse";
import {Table, Title, TextInput, Button, Box, Code} from '@mantine/core';
import './index.scss';
import {useNavigate, useParams} from "react-router-dom";
import {IStore} from "../../../domain/IStore";
import {useForm} from '@mantine/form';
import {StoreService} from "../../../services/StoreService";

interface props {
    storageType: string
};

interface formProps {
    name: string,
    address: string,
};

const CreateOrEditStorage: FC<props> = ({storageType}) => {
    const {id} = useParams();

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const [data, setData] = useState<IWarehouse | IStore | null>(null);

    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const warehouseService = new WarehouseService(setJwtResponse!);
    const storeService = new StoreService(setJwtResponse!);
    const navigate = useNavigate();

    const form = useForm<formProps | null>({
        initialValues: {
            name: '',
            address: '',
        },
    });

    const onSubmit = async (values: formProps | null) => {
        if (!values) {
            setValidationErrors(["Bad input values"]);
            return;
        };

        if (values.name.length < 5 || values.address.length < 5) {
            setValidationErrors(["At least 5 letters"]);
            return;
        }
        // remove errors
        setValidationErrors([]);
        if (storageType === 'warehouses') {
            if(!id){
                var entity = await warehouseService.createEntity(values, jwtResponse!);
                if (!entity?.id) {
                    setValidationErrors(['Bad request']);
                    return;
                } else {
                    navigate(`/${storageType}`);
                }
            } else {
                var result = await warehouseService.updateEntity(values, jwtResponse!);
                if (!result) {
                    setValidationErrors(['Bad request']);
                    return;
                } else {
                    navigate(`/${storageType}`);
                }
            }
        }
        if (storageType === 'stores') {
            if (!id) {
                var entity = await storeService.createEntity(values, jwtResponse!);
            if (!entity?.id) {
                setValidationErrors(['Bad request']);
                return;
            } else {
                navigate(`/${storageType}`);
            }
            } else {
                var result = await storeService.updateEntity(values, jwtResponse!);
                if (!result) {
                    setValidationErrors(['Bad request']);
                    return;
                } else {
                    navigate(`/${storageType}`);
                }
            }
            
        }
    }

    useEffect(() => {
        if (!id) return;
        if (jwtResponse) {
            if (storageType !== 'stores') {
                warehouseService.getEntity(id, jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            form.setValues(response);
                            setData(response);
                        } else {
                            // redirect to login because of refresh request error
                            setData(null);
                        }
                    }
                );
            }
            if (storageType === 'stores') {
                storeService.getEntity(id, jwtResponse).then(
                    response => {
                        console.log(response);
                        if (response) {
                            
                            form.setValues(response);
                            setData(response);
                        } else {
                            // redirect to login because of refresh request error
                            setData(null);
                        }
                    }
                );
            }

        }
    }, [id]);

    return (
        <>
            <Title mx="10%" pt="50px" order={2} style={{marginTop: '25px'}}>
                {data?.id ? ' Edit' : 'Create new'} {storageType !== 'stores' ? 'warehouse' : 'store'}
            </Title>
            <Box maw={400} mx="10%" my='50px'>

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
                        label="Address"
                        placeholder="Address"
                        mt="md"
                        {...form.getInputProps('address')}
                    />
                    <Button mt='20%' type="submit">
                        {data?.id ? 'Edit' : 'Create'} {storageType !== 'stores' ? 'warehouse' : 'store'}
                    </Button>
                </form>
            </Box>
        </>
    );
}

export default CreateOrEditStorage;