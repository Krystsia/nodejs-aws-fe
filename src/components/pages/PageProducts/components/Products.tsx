import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {Product} from "models/Product";
import {formatAsPrice} from "utils/utils";
import AddProductToCart from "components/AddProductToCart/AddProductToCart";

import axios from 'axios';
import API_PATHS from "../../../../constants/apiPaths";
import {Popover} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Products() {
  const classes = useStyles();
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setPopover] = useState<boolean>(false);
  const [productsAdditionalData, setProductsAdditionalData] = useState<Map<string, Product>>(new Map());
  const [productAdditionalData, setProductAdditionalData] = useState<Product | null>(null);

  useEffect(() => {
    axios.get(`${API_PATHS.product}/products-list`)
      .then(res => {
        setProducts(res.data)
      });
  }, [])

  const handlePopoverOpen = (productId: string) => {
    const product: Product | undefined = productsAdditionalData.get(productId);

    if (product) {
      setProductAdditionalData(product)
      setPopover(true);
    } else {
      axios.get(`${API_PATHS.product}/products/${productId}`)
        .then(res => {
          productsAdditionalData.set(res.data.id, res.data);
          setProductsAdditionalData(productsAdditionalData);
          setProductAdditionalData(res.data);
          setPopover(true);
        });
    }
  }

  return (
    <Grid container spacing={4}>
      {products.map((product: Product, index: number) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <Card
            className={classes.card}
            onClick={() => handlePopoverOpen(product.id)}
          >
            <CardMedia
              className={classes.cardMedia}
              image={`https://source.unsplash.com/random?sig=${index}`}
              title="Image title"
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {product.title}
              </Typography>
              <Typography>
                {formatAsPrice(product.price)}
              </Typography>
            </CardContent>
            <CardActions>
              <AddProductToCart product={product}/>
            </CardActions>
          </Card>
          <Popover
            open={open}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            onClose={() => setPopover(false)}
          >
            <Typography gutterBottom variant="h5" component="h2">
              {productAdditionalData?.title}
            </Typography>
            <Typography>
              {productAdditionalData && formatAsPrice(productAdditionalData?.price)}
            </Typography>

          </Popover>
        </Grid>
      ))}
    </Grid>
  );
}
