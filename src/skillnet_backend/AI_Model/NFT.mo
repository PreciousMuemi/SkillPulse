import Types "types";

actor NFT {
  type NFT = Types.NFT;

  private stable var nfts : [NFT] = [];

  public func mintNFT(userId : Nat, name : Text, description : Text, image : Text) : async Nat {
    let id = nfts.size();
    let newNFT : NFT = {
      id = id;
      userId = userId;
      name = name;
      description = description;
      image = image;
    };
    nfts := Array.append(nfts, [newNFT]);
    id
  };

  public query func getNFT(id : Nat) : async ?NFT {
    if (id < nfts.size()) {
      ?nfts[id]
    } else {
      null
    }
  };

  public query func getUserNFTs(userId : Nat) : async [NFT] {
    Array.filter(nfts, func (nft : NFT) : Bool { nft.userId == userId })
  };
};