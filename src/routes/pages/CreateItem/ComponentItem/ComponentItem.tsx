import {useContext, useEffect, useState, FC, FormEvent} from "react";
import {JwtContext} from "../../../Root";
import {Table, Title, TextInput, Button, Box, Select, Flex} from '@mantine/core';
import './index.scss';
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from '@mantine/form';
import {IItem} from "../../../../domain/IItem";
import {ICategory} from "../../../../domain/ICategory";
import {IItemComponent} from "../../../../domain/IItemComponent";
import {IUnit} from "../../../../domain/IUnit";
import {ItemService} from "../../../../services/ItemService";
import {UnitService} from "../../../../services/UnitService";
import {ItemComponentService} from "../../../../services/ItemComponentService";


interface props {
    currentItemId?: string;
};

interface itemFormProps {
    name: string,
    description?: string,
    itemComponents?: IItemComponent[] | [],
    unit?: IUnit,
    category?: ICategory,
}

const ComponentItem: FC<props> = ({currentItemId}) => {

    const {id} = useParams();

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const [data, setData] = useState<IItem[] | null>(null);
    const [currentItem, setItem] = useState<string | undefined | null>(undefined);
    const [amount, setAmount] = useState<string | undefined>(undefined);

    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const itemService = new ItemService(setJwtResponse!);
    const itemComponentService = new ItemComponentService(setJwtResponse!);
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtResponse) {
            itemService.getAll(jwtResponse).then(
                response => {
                    console.log(response);
                    if (response) {
                        setData(response.filter(i => i.id !== id));
                    } else {
                        // redirect to login because of refresh request error
                        setData([]);
                    }
                }
            );
        }
    }, [])

    const handleSubmit = async () => {

        if (currentItem?.length === undefined || amount === undefined) {
            setValidationErrors(["Bad input values"]);
            return;
        }
        var values: IItemComponent = {
            componentItemId: currentItem,
            itemId: currentItemId!,
            componentQuantity: amount,
        };

        // remove errors
        setValidationErrors([]);
        if (id) {
            //@ts-ignore
            var entity = await itemComponentService.createEntity(values, jwtResponse!);
            if (!entity?.id) {
                setValidationErrors(['Bad request']);
                return;
            } else {
                setAmount('');
                setItem('');
                navigate(`/items/${currentItemId}`, {state: Math.random()});
            }
        }
    }

    return (
        <>
            <form
                style={{width: 'fit-content'}}
            >
                <div className="add-component" style={{display: 'flex', position: "relative", columnGap: '12px', alignItems: 'end'}}>
                    <Select
                        searchable
                        w={175}
                        mt='15px'
                        label="Add component"
                        value={currentItem}
                        onChange={value => setItem(value)}
                        disabled={!id}
                        //@ts-ignore
                        data={data?.map(item => ({label: item.name, value: item?.id})) ?? []} />
                    <TextInput
                        disabled={!id}
                        w={100}
                        type="number"
                        label="Amount"
                        placeholder="Amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        mt="md"
                    />
                    <Select w={100}
                        key={currentItem}
                        mt='15px'
                        label="Unit"
                        placeholder={data?.find(i => i.id === currentItem)?.unit.name}
                        disabled
                        //@ts-ignore
                        data={[]}
                    />
                    <Button
                        disabled={!id}
                        mt={"15px"}
                        onClick={handleSubmit}
                    >
                        +
                    </Button>
                </div>
                <ul style={{'display': validationErrors.length == 0 ? 'none' : ''}}>
                    <li style={{color: 'red'}}>{validationErrors.length > 0 ? validationErrors[0] : ''}</li>
                </ul>
            </form>
        </>
    );
}

export default ComponentItem;