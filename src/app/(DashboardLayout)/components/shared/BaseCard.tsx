import React, { ReactNode } from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  cardheading?: boolean;
  headtitle?: string | ReactNode;
  headsubtitle?: string | ReactNode;
  children?: ReactNode | ReactNode[]; // Permitindo múltiplos filhos
  middlecontent?: string | ReactNode;
  style?: React.CSSProperties;
}

const BaseCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
  style,
}: DashboardCardProps) => {
  return (
    <Card sx={{ padding: 0 }} elevation={9} variant={undefined} style={style}>
      {cardheading ? (
        <CardContent>
          <Typography variant="h4">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: "30px" }}>
          {title && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={"center"}
              mb={3}
            >
              <Box>
                <Typography variant="h4">{title}</Typography>
                {subtitle && (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {action}
            </Stack>
          )}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </Card>
  );
};

export default BaseCard;
