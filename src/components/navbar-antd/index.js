import { FieldNumberOutlined,RightCircleFilled } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { Link } from "react-router-dom";
const items = [
  {
    label: <Link to="/">RONCO</Link>,
    key: 'home',
    icon: <RightCircleFilled />,
  },
  {
    label: <Link to="/disease">Disease</Link>,
    key: 'disease',
    icon: <FieldNumberOutlined />,
  },
  {
    label: <Link to="/gene">Gene</Link>,
    key: 'gene',
    icon: <FieldNumberOutlined />,
  },
  {
    label: <Link to="/variant">Variant</Link>,
    key: 'variant',
    icon: <FieldNumberOutlined />,
  },
  {
    label: <Link to="/drug">Drug</Link>,
    key: 'drug',
    icon: <FieldNumberOutlined />,
  },
  {
    label: <Link to="/evidence">Evidence</Link>,
    key: 'evidence',
    icon: <FieldNumberOutlined />,
  },
  {
    label: <Link to="/extract">Extract</Link>,
    key: 'extract',
    icon: <FieldNumberOutlined />,
  },
];

const NavBar = () =>{
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
}

export default NavBar;