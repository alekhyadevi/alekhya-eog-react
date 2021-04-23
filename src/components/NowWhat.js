import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from './Avatar';
import Select from '@material-ui/core/Select'
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { MenuItem } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {useQuery} from 'urql'

const client = new ApolloClient({
  uri: "https://react.eogresources.com/graphql",
  cache: new InMemoryCache()
});

const useStyles = makeStyles({
  card: {
    margin: '5% 25%',
  },
});

export default () => {
  const [metricOptions, setMetricOptions] = useState([])
  const [selectedMetric, setSelectedMetric] = useState('')
  const classes = useStyles();

  useEffect(() => {
    client
    .query({
      query: gql`
        query {
          getMetrics
        }
      `
    })
    .then((result) => setMetricOptions(result.data.getMetrics));
  }, [])

  if(selectedMetric) {
    const [result] = useQuery({
      query: `
        query($input: MeasurementQuery!) {
          getMeasurement(input: $input) {
            metric
            at
            value
            unit
          }
        }
      `,
      variables: {
        input: {
          metricName: selectedMetric
        }
      }
    })
    console.log('result', result)
  }
  
  console.log("selectedMetric", selectedMetric)

  const handleChange = event => {
    setSelectedMetric(event.target.value)
  }

  return (
    <Card className={classes.card}>
      <CardHeader title="OK, alekhya, you're all setup. Now What?" />
      <CardContent>
        <List>
          <ListItem>
            <Avatar>1</Avatar>
            <ListItemText primary="Explore the GraphQL API" />
          </ListItem>
          <ListItem>
            <Avatar>2</Avatar>
            <ListItemText primary="Add ability to select Metrics" />
          </ListItem>
          <ListItem>
            <Avatar>3</Avatar>
            <ListItemText primary="Display the current metric data" />
          </ListItem>
          <ListItem>
            <Avatar>4</Avatar>
            <ListItemText primary="Chart historical metric data" />
          </ListItem>
          <ListItem>
            <Avatar>5</Avatar>
            <ListItemText primary="Submit Your App" />
          </ListItem>
        </List>
        
        <FormControl>
        <InputLabel id='Select Metric'>Select Metric</InputLabel>
        <Select labelId={'Select Metric'} value={selectedMetric}
          onChange={handleChange}>
          {metricOptions.map(metric => {
            return <MenuItem key={metric} value={metric}>{metric}</MenuItem>
          })}
        </Select>
      </FormControl>

        <div>
          <p>{selectedMetric}</p>  
        </div>  

        <Typography variant="body1">
          Remember to refer to our <a href="https://react.eogresources.com/assessing">How We Assess Submissions</a>{' '}
          guidelines, as well as the <a href="https://react.eogresources.com/api">GraphQL API Documentation</a>.
        </Typography>
      </CardContent>
    </Card>
  );
};
