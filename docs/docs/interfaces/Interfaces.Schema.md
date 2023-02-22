[metronom](../README.md) / [Modules](../modules.md) / [Interfaces](../modules/Interfaces.md) / Schema

# Interface: Schema

[Interfaces](../modules/Interfaces.md).Schema

Schema of Metronom model

**`Interface`**

**`Memberof`**

Model

**`Example`**

```
import { Types } from 'metronom';
const schema = {
  isAdmin: {
    type: Types.Boolean,
    default: false,
  }
};
```

## Indexable

▪ [index: `string`]: { `type`: `any` ; `default?`: `unknown`  }
