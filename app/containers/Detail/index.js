import React from 'react';
// material-ui components
import { withStyles } from '@material-ui/core';
// material-ui-icons
// import { Dashboard, Schedule, Info, LocationOn, Gavel, HelpOutline } from '@material-ui/icons';
// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import RegularCard from 'components/Cards/RegularCard';
import NavPills from 'components/NavPills/NavPills';
import Checkbox from 'components/Checkbox';
// import Accordion from 'components/Accordion/Accordion';
import { NavLink } from 'react-router-dom';
import ImageUpload from 'components/CustomUpload/ImageUpload';
import { red } from '@material-ui/core/colors';

const styles = {
  pageSubcategoriesTitle: {
    color: '#3C4858',
    textDecoration: 'none',
    textAlign: 'center',
  },
  itemGridInfoProduct: {},
  imgItemGridInfoProduct: {
    padding: '15px',
    width: '120px',
    border: '1px solid lightblue ',
  },
  itemGridTwoInfoProduct: {
    textAlign: 'justify',
  },
  hrItemGridTwoInfoProduct: {
    border: '1px solid pink',
  },
};
class Panels extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      activeProduct: 3,
      columns: [
        { name: 'codePro', title: 'Mã sản phẩm' },
        { name: 'barCode', title: 'Mã vạch' },
        { name: 'cate', title: 'Tên	Danh mục' },
        { name: 'name', title: 'Tên Sản Phẩm' },
        { name: 'image', title: 'Ảnh Sản Phẩm' },
        { name: 'sizePro', title: 'Kích thước' },
        { name: 'salePrice', title: 'Giá bán' },
        { name: 'costPrice', title: 'Giá vốn' },
        { name: 'amount', title: 'Số lượng' },
        { name: 'amountTotal', title: 'Tổng số lượng' },
        { name: 'inventory', title: 'Hàng tồn kho' },
        { name: 'action', title: 'HÀNH ĐỘNG' },
        { name: 'status', title: 'TRẠNG THÁI' },
      ],
      tableColumnExtensions: [{ columnName: 'codePro', width: 100 }],
      rows: [
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/detail-product/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 2,
          codePro: 'T1189',
          barCode: '234',
          name: 'Quần Kaki Túi Hộp HST727',
          image: 'http://erpdemo.lifetek.vn/customImages/5898663372c8e19c34cd6927/589892421e8e013c32868ea7.jpeg',
          cate: 'Quần',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 3,
          codePro: 'HD112',
          barCode: '234',
          name: 'Quần đũi nam dáng quần âu ghi',
          image: 'http://erpdemo.lifetek.vn/customImages/5898663372c8e19c34cd691d/58988eabcb05c94840f456f1.jpeg',
          cate: 'Quần',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
      ],
    };
  }

  onShowPro = value => {
    alert(value);
  };

  render() {
    const { rows, columns } = this.state;
    const { classes } = this.props;
    const newRows = rows.map(item => {
      const image = <img style={{ width: '50px' }} src={item.image} />;
      return { ...item, image };
    });
    const list = newRows.map(listt => (
      <RegularCard
        content={
          <GridContainer onClick={() => this.setState({ activeProduct: listt.id })}>
            <ItemGrid xs={6}>
              <p>{listt.name}</p>
            </ItemGrid>
            <ItemGrid xs={6}>
              <p>{listt.image}</p>
            </ItemGrid>
          </GridContainer>
        }
        contentAlign="center"
      />
    ));
    const productInfo = rows.find(item => item.id === this.state.activeProduct);
    return (
      <div>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle={
                <span>
                  Navigation Pills <small> - Horizontal Tabs</small>
                </span>
              }
              content={
                <NavPills
                  color="gradient"
                  tabs={[
                    {
                      tabButton: 'Thông Tin Sản Phẩm',
                      tabContent: (
                        <GridContainer>
                          <ItemGrid xs={3}>{list}</ItemGrid>
                          <ItemGrid xs={5}>
                            <RegularCard
                              content={
                                <GridContainer>
                                  <ItemGrid className={classes.itemGridInfoProduct} xs={12} sm={4} md={4}>
                                    <img className={classes.imgItemGridInfoProduct} src={productInfo.image} />
                                  </ItemGrid>
                                  <ItemGrid className={classes.itemGridTwoInfoProduct} xs={12} sm={12} md={8}>
                                    <h3>Product Name</h3>
                                    {productInfo.name}
                                    <hr className={classes.hrItemGridTwoInfoProduct} />
                                    <div>
                                      <Checkbox /> <span>Còn Hàng</span>
                                    </div>

                                    <div>
                                      <Checkbox />
                                      <span>Hết Hàng</span>
                                    </div>
                                    <div>
                                      <Checkbox />
                                      <span>Hiển Thị</span>
                                    </div>
                                  </ItemGrid>
                                </GridContainer>
                              }
                              contentAlign="center"
                            />
                          </ItemGrid>
                          <ItemGrid xs={4}>
                            <RegularCard content={<div>Hiển thị SKU</div>} contentAlign="center" />
                          </ItemGrid>
                        </GridContainer>
                      ),
                    },
                    {
                      tabButton: 'Settings',
                      tabContent: (
                        <span>
                          <p>
                            Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time
                            schemas.
                          </p>
                          <br />
                          <p>Dramatically maintain clicks-and-mortar solutions without functional solutions.</p>
                        </span>
                      ),
                    },
                    {
                      tabButton: 'Options',
                      tabContent: (
                        <span>
                          <p>
                            Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate service with robust
                            ideas.{' '}
                          </p>
                          <br />
                          <p>Dynamically innovate resource-leveling customer service for state of the art customer service.</p>
                        </span>
                      ),
                    },
                  ]}
                />
              }
            />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}
export default withStyles(styles)(Panels);
