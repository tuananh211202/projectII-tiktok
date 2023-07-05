import { Button, Divider, Input, Row } from 'antd';
import React from 'react';
import { BsSearch } from "react-icons/bs";

const SearchBox = () => {
    return (
        <Row className="w-1/3 relative">
            <Input 
                className="w-full rounded-3xl h-10 pl-5 pr-14" 
                placeholder='Search'
                style={{fontFamily: "Signika", fontWeight: 500}}
            />
            <Divider type="vertical" className="absolute h-8 right-10 top-1" />
            <Button className="m-0 p-0 border-none absolute h-full right-5">
                <BsSearch />
            </Button>
        </Row>
    );
}

export default SearchBox;